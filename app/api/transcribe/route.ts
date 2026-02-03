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
  let inputPath = '';
  let audioPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string || 'auto';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filenames
    const uniqueId = uuidv4();
    const fileExt = file.name.split('.').pop() || 'mp4';
    inputPath = path.join(tempDir, `${uniqueId}_input.${fileExt}`);
    audioPath = path.join(tempDir, `${uniqueId}_audio.mp3`);

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    console.log(`Transcribing ${inputPath}...`);

    // Extract audio if it's a video file
    if (file.type.startsWith('video/') || fileExt.match(/mp4|avi|mkv|webm|mov/i)) {
      await extractAudio(inputPath, audioPath);
    } else {
      // If it's already audio, just copy it
      fs.copyFileSync(inputPath, audioPath);
    }

    // Transcribe using OpenAI Whisper API
    const transcription = await transcribeWithWhisper(audioPath, language);

    // Clean up files
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    return NextResponse.json(transcription);
  } catch (error: any) {
    console.error('Transcription error:', error);

    // Clean up files on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (audioPath && fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    return NextResponse.json(
      { error: 'Transcription failed', details: error.message },
      { status: 500 }
    );
  }
}

function extractAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vn', // No video
      '-acodec', 'libmp3lame',
      '-b:a', '128k',
      '-y',
      outputPath
    ]);

    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${errorOutput}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

async function transcribeWithWhisper(audioPath: string, language: string): Promise<any> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('🔑 Checking OpenAI API key...');
    console.log('API key exists:', !!apiKey);
    console.log('API key length:', apiKey?.length || 0);
    console.log('API key prefix:', apiKey?.substring(0, 20) || 'none');

    if (!apiKey) {
      console.warn('❌ OpenAI API key not configured. Using fallback method.');
      return await transcribeWithFallback(audioPath);
    }

    // Check file size (OpenAI Whisper has a 25MB limit)
    const stats = fs.statSync(audioPath);
    console.log('📁 Audio file size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');

    if (stats.size > 25 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 25MB. Please use a shorter audio file.');
    }

    console.log('🎙️ Preparing to send to OpenAI Whisper API...');
    console.log('Language:', language);

    // Use dynamic import for form-data and node-fetch (same as identify-music)
    const FormData = (await import('form-data')).default;
    const nodeFetch = (await import('node-fetch')).default;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath), {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    formData.append('model', 'whisper-1'); // whisper-1 is the only available model (most advanced)
    formData.append('response_format', 'verbose_json'); // Get detailed response with timestamps
    formData.append('temperature', '0'); // 0 = more focused and deterministic, 1 = more creative

    if (language !== 'auto') {
      formData.append('language', language);
    }

    // Optional: Add prompt for better context (uncomment if needed)
    // formData.append('prompt', 'This is a transcription of audio content.');

    console.log('📤 Sending request to OpenAI...');

    // @ts-ignore - node-fetch supports form-data
    const response = await nodeFetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI Whisper API error:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }

      throw new Error(errorData.error?.message || 'Transcription failed');
    }

    const data = await response.json();
    console.log('✅ Transcription successful!');
    console.log('Detected language:', data.language);
    console.log('Text length:', data.text?.length || 0);

    return {
      text: data.text,
      segments: data.segments?.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })),
      language: data.language,
    };
  } catch (error: any) {
    console.error('❌ Whisper transcription error:', error.message);
    console.error('Full error:', error);
    // Don't fallback on error - throw it so user knows what went wrong
    throw error;
  }
}

async function transcribeWithFallback(audioPath: string): Promise<any> {
  // Fallback method: Use ffmpeg to extract basic information
  // This is a very basic fallback and won't provide actual transcription
  // In a real scenario, you might want to use a local Whisper model or another service
  
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
          const duration = parseFloat(data.format?.duration || '0');
          
          resolve({
            text: 'Transcription service not available. Please configure OpenAI API key to enable AI transcription.',
            segments: [
              {
                start: 0,
                end: duration,
                text: 'Transcription service not available. Please configure OpenAI API key to enable AI transcription.',
              }
            ],
            language: 'en',
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

