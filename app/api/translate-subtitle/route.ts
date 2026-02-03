import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure temp directory exists
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  let inputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;

    if (!file || !targetLang) {
      return NextResponse.json(
        { error: 'File and target language are required' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExt = file.name.split('.').pop() || 'srt';
    inputPath = path.join(tempDir, `${uniqueId}.${fileExt}`);

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    // Read and parse subtitle file
    const content = fs.readFileSync(inputPath, 'utf-8');
    const subtitles = parseSRT(content);

    // Translate each subtitle
    const translatedSubtitles = await translateSubtitles(subtitles, sourceLang, targetLang);

    // Generate translated SRT content
    const translatedContent = generateSRT(translatedSubtitles);

    // Clean up input file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Return translated file
    return new NextResponse(translatedContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="translated_${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error('Subtitle translation error:', error);

    // Clean up file on error
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    return NextResponse.json(
      { error: 'Subtitle translation failed', details: error.message },
      { status: 500 }
    );
  }
}

interface Subtitle {
  index: number;
  start: string;
  end: string;
  text: string;
}

function parseSRT(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const blocks = content.trim().split('\n\n');

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0]);
      const [start, end] = lines[1].split(' --> ');
      const text = lines.slice(2).join('\n');

      subtitles.push({ index, start, end, text });
    }
  }

  return subtitles;
}

function generateSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub) => `${sub.index}\n${sub.start} --> ${sub.end}\n${sub.text}\n`)
    .join('\n');
}

async function translateSubtitles(
  subtitles: Subtitle[],
  sourceLang: string,
  targetLang: string
): Promise<Subtitle[]> {
  const translatedSubtitles: Subtitle[] = [];

  // Translate in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < subtitles.length; i += batchSize) {
    const batch = subtitles.slice(i, i + batchSize);
    
    const translatedBatch = await Promise.all(
      batch.map(async (sub) => {
        try {
          const translatedText = await translateText(sub.text, sourceLang, targetLang);
          return { ...sub, text: translatedText };
        } catch (error) {
          console.error(`Failed to translate subtitle ${sub.index}:`, error);
          return sub; // Return original if translation fails
        }
      })
    );

    translatedSubtitles.push(...translatedBatch);

    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < subtitles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return translatedSubtitles;
}

async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const langPair = sourceLang === 'auto' ? `auto|${targetLang}` : `${sourceLang}|${targetLang}`;
    const encodedText = encodeURIComponent(text);
    
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    );

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    throw new Error('Translation not available');
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

