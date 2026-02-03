import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure temp directory exists
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  let audioPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExt = file.name.split('.').pop() || 'mp3';
    audioPath = path.join(tempDir, `${uniqueId}.${fileExt}`);

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(audioPath, buffer);

    // Extract metadata using ffprobe
    const metadata = await extractMetadata(audioPath);

    // Clean up file
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error('Metadata extraction error:', error);

    // Clean up file on error
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    return NextResponse.json(
      { error: 'Failed to extract metadata', details: error.message },
      { status: 500 }
    );
  }
}

function extractMetadata(audioPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      audioPath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(output);
          const tags = data.format?.tags || {};
          
          // Extract artwork if available
          let artwork = undefined;
          const videoStream = data.streams?.find((s: any) => s.codec_type === 'video');
          if (videoStream) {
            // Artwork is embedded, we'll extract it separately if needed
            artwork = undefined; // For now, we'll handle this in the update route
          }

          resolve({
            title: tags.title || tags.TITLE || '',
            artist: tags.artist || tags.ARTIST || '',
            album: tags.album || tags.ALBUM || '',
            year: tags.date || tags.DATE || tags.year || tags.YEAR || '',
            genre: tags.genre || tags.GENRE || '',
            artwork,
          });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`ffprobe exited with code ${code}`));
      }
    });

    ffprobe.on('error', reject);
  });
}

