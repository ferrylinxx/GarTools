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

    console.log(`Identifying music from ${audioPath}...`);

    // Try to identify using AudD API (free tier)
    let songInfo = await identifyWithAudD(audioPath);

    if (!songInfo) {
      console.log('AudD identification failed, trying metadata extraction...');
      // Fallback: Try to extract metadata from file
      songInfo = await extractMetadata(audioPath);
    }

    // Clean up file after all attempts
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    if (!songInfo) {
      return NextResponse.json(
        { error: 'Could not identify song. The audio may not be clear enough, or the song is not in the database. Try with a popular song or a clearer audio sample.' },
        { status: 404 }
      );
    }

    return NextResponse.json(songInfo);
  } catch (error: any) {
    console.error('Identification error:', error);

    // Clean up file on error
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    return NextResponse.json(
      { error: 'Failed to identify music', details: error.message },
      { status: 500 }
    );
  }
}

async function identifyWithAudD(audioPath: string): Promise<any> {
  try {
    // AudD API - Free tier allows 100 requests per day
    // You can get a free API key from https://audd.io/
    const apiKey = process.env.AUDD_API_KEY || 'test'; // 'test' key for demo purposes

    console.log('Using AudD API with key:', apiKey === 'test' ? 'test (demo)' : 'configured');
    console.log('API key value:', apiKey.substring(0, 10) + '...');

    // Use dynamic import for form-data and node-fetch
    const FormData = (await import('form-data')).default;
    const nodeFetch = (await import('node-fetch')).default;

    // Create form data with file
    const formData = new FormData();
    formData.append('api_token', apiKey);
    formData.append('file', fs.createReadStream(audioPath), {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });

    console.log('FormData headers:', formData.getHeaders());

    // @ts-ignore - node-fetch supports form-data
    const response = await nodeFetch('https://api.audd.io/', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      console.error('AudD API HTTP error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('AudD API response:', JSON.stringify(data, null, 2));

    if (data.status === 'success' && data.result) {
      const result = data.result;

      console.log('Song identified:', result.title, 'by', result.artist);

      return {
        title: result.title,
        artist: result.artist,
        album: result.album || undefined,
        releaseDate: result.release_date || undefined,
        artwork: result.streaming?.album?.images?.[0]?.url || undefined,
      };
    }

    if (data.status === 'error') {
      console.error('AudD API error:', data.error);
    } else {
      console.log('No result found in AudD response');
    }

    return null;
  } catch (error) {
    console.error('AudD identification error:', error);
    return null;
  }
}

async function extractMetadata(audioPath: string): Promise<any> {
  try {
    // Use ffprobe to extract metadata
    const metadata = await getAudioMetadata(audioPath);
    
    if (metadata.title && metadata.artist) {
      return {
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        releaseDate: metadata.date,
      };
    }

    return null;
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return null;
  }
}

function getAudioMetadata(audioPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
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
          
          resolve({
            title: tags.title || tags.TITLE,
            artist: tags.artist || tags.ARTIST,
            album: tags.album || tags.ALBUM,
            date: tags.date || tags.DATE,
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

