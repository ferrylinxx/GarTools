import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface AudioEnhanceOptions {
  normalize?: boolean;
  noiseReduction?: boolean;
  bass?: number; // -20 to 20
  mid?: number; // -20 to 20
  treble?: number; // -20 to 20
  compression?: boolean;
  reverb?: boolean;
  fadeIn?: number; // seconds
  fadeOut?: number; // seconds
  preset?: 'podcast' | 'music' | 'voice' | 'custom';
}

const tempDir = path.join(process.cwd(), 'temp');

export async function POST(request: NextRequest) {
  let inputPath = '';
  let outputPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: AudioEnhanceOptions = optionsStr ? JSON.parse(optionsStr) : {};

    // Apply preset if specified
    if (options.preset && options.preset !== 'custom') {
      applyPreset(options);
    }

    // Generate unique filenames
    const uniqueId = uuidv4();
    const inputExt = file.name.split('.').pop() || 'mp3';
    inputPath = path.join(tempDir, `${uniqueId}_input.${inputExt}`);
    outputPath = path.join(tempDir, `${uniqueId}_enhanced.${inputExt}`);

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    console.log(`Enhancing audio: ${inputPath}`);

    // Enhance audio using ffmpeg
    await enhanceAudio(inputPath, outputPath, options);

    // Read enhanced file
    const enhancedFile = fs.readFileSync(outputPath);

    // Clean up input file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Return enhanced file
    const response = new NextResponse(enhancedFile, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="enhanced_${file.name}"`,
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
    console.error('Audio enhancement error:', error);

    // Clean up files on error
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return NextResponse.json(
      { error: 'Audio enhancement failed', details: error.message },
      { status: 500 }
    );
  }
}

function applyPreset(options: AudioEnhanceOptions) {
  switch (options.preset) {
    case 'podcast':
      options.normalize = true;
      options.noiseReduction = true;
      options.compression = true;
      options.bass = -2;
      options.mid = 3;
      options.treble = 2;
      break;
    case 'music':
      options.normalize = true;
      options.bass = 3;
      options.mid = 0;
      options.treble = 2;
      break;
    case 'voice':
      options.normalize = true;
      options.noiseReduction = true;
      options.compression = true;
      options.bass = -3;
      options.mid = 5;
      options.treble = 1;
      break;
  }
}

function enhanceAudio(inputPath: string, outputPath: string, options: AudioEnhanceOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const filters: string[] = [];

    // Noise reduction (using highpass and lowpass filters)
    if (options.noiseReduction) {
      filters.push('highpass=f=200');
      filters.push('lowpass=f=3000');
      filters.push('afftdn=nf=-25');
    }

    // Equalization
    if (options.bass !== undefined && options.bass !== 0) {
      filters.push(`bass=g=${options.bass}`);
    }
    if (options.treble !== undefined && options.treble !== 0) {
      filters.push(`treble=g=${options.treble}`);
    }

    // Compression
    if (options.compression) {
      filters.push('acompressor=threshold=-20dB:ratio=4:attack=5:release=50');
    }

    // Normalization
    if (options.normalize) {
      filters.push('loudnorm=I=-16:TP=-1.5:LRA=11');
    }

    // Reverb
    if (options.reverb) {
      filters.push('aecho=0.8:0.9:1000:0.3');
    }

    // Fade in/out
    if (options.fadeIn) {
      filters.push(`afade=t=in:st=0:d=${options.fadeIn}`);
    }
    if (options.fadeOut) {
      filters.push(`afade=t=out:st=0:d=${options.fadeOut}`);
    }

    const args = ['-i', inputPath];

    if (filters.length > 0) {
      args.push('-af', filters.join(','));
    }

    args.push('-y', outputPath);

    console.log('FFmpeg args:', args.join(' '));

    const ffmpeg = spawn('ffmpeg', args);

    let stderrOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      const output = data.toString();
      stderrOutput += output;
      console.log(`FFmpeg: ${output}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.error('FFmpeg stderr:', stderrOutput);
        reject(new Error(`FFmpeg exited with code ${code}. Check logs for details.`));
      }
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg spawn error:', error);
      reject(error);
    });
  });
}

