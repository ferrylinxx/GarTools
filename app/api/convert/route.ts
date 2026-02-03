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
  let outputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const outputFormat = formData.get('outputFormat') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!outputFormat) {
      return NextResponse.json({ error: 'No output format specified' }, { status: 400 });
    }

    // Validate output format
    const validFormats = ['mp4', 'avi', 'mkv', 'webm', 'mov', 'mp3', 'aac', 'flac', 'wav', 'ogg'];
    if (!validFormats.includes(outputFormat)) {
      return NextResponse.json({ error: 'Invalid output format' }, { status: 400 });
    }

    // Generate unique filenames
    const uniqueId = uuidv4();
    const inputExt = file.name.split('.').pop() || 'tmp';
    inputPath = path.join(tempDir, `${uniqueId}_input.${inputExt}`);
    outputPath = path.join(tempDir, `${uniqueId}_output.${outputFormat}`);

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    console.log(`Converting ${inputPath} to ${outputFormat}...`);

    // Convert file using ffmpeg
    await convertFile(inputPath, outputPath, outputFormat);

    // Read converted file
    const convertedFile = fs.readFileSync(outputPath);

    // Clean up input file immediately
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Determine MIME type
    const mimeType = getMimeType(outputFormat);

    // Return converted file
    const response = new NextResponse(convertedFile, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="converted.${outputFormat}"`,
      },
    });

    // Clean up output file after a delay
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 5000);

    return response;
  } catch (error: any) {
    console.error('Conversion error:', error);

    // Clean up files on error
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return NextResponse.json(
      { error: 'Conversion failed', details: error.message },
      { status: 500 }
    );
  }
}

function convertFile(inputPath: string, outputPath: string, outputFormat: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      '-i', inputPath,
      '-y', // Overwrite output file
    ];

    // Add format-specific options
    switch (outputFormat) {
      case 'mp4':
        args.push('-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental');
        break;
      case 'avi':
        args.push('-c:v', 'mpeg4', '-c:a', 'mp3');
        break;
      case 'mkv':
        args.push('-c:v', 'libx264', '-c:a', 'aac');
        break;
      case 'webm':
        args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
        break;
      case 'mov':
        args.push('-c:v', 'libx264', '-c:a', 'aac');
        break;
      case 'mp3':
        args.push('-vn', '-c:a', 'libmp3lame', '-b:a', '320k');
        break;
      case 'aac':
        args.push('-vn', '-c:a', 'aac', '-b:a', '256k');
        break;
      case 'flac':
        args.push('-vn', '-c:a', 'flac');
        break;
      case 'wav':
        args.push('-vn', '-c:a', 'pcm_s16le');
        break;
      case 'ogg':
        args.push('-vn', '-c:a', 'libvorbis', '-b:a', '256k');
        break;
    }

    args.push(outputPath);

    const ffmpeg = spawn('ffmpeg', args);

    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('FFmpeg:', data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('Conversion completed successfully');
        resolve();
      } else {
        console.error('FFmpeg error:', errorOutput);
        reject(new Error(`FFmpeg exited with code ${code}: ${errorOutput}`));
      }
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg spawn error:', error);
      reject(error);
    });
  });
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    aac: 'audio/aac',
    flac: 'audio/flac',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
  };

  return mimeTypes[format] || 'application/octet-stream';
}

