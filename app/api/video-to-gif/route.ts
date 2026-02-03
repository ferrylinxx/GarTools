import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface GifOptions {
  startTime: number; // seconds
  duration: number; // seconds
  fps?: number; // 5-30
  width?: number; // pixels
  quality?: 'low' | 'medium' | 'high';
  loop?: boolean;
  reverse?: boolean;
}

const tempDir = path.join(process.cwd(), 'temp');

export async function POST(request: NextRequest) {
  let inputPath = '';
  let outputPath = '';
  let reversedPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const options: GifOptions = optionsStr ? JSON.parse(optionsStr) : {
      startTime: 0,
      duration: 3,
      fps: 15,
      width: 480,
      quality: 'medium',
      loop: true,
      reverse: false,
    };

    // Validate options
    if (options.duration > 10) {
      return NextResponse.json(
        { error: 'Duration cannot exceed 10 seconds for GIF conversion' },
        { status: 400 }
      );
    }

    // Generate unique filenames
    const uniqueId = uuidv4();
    const inputExt = file.name.split('.').pop() || 'mp4';
    inputPath = path.join(tempDir, `${uniqueId}_input.${inputExt}`);
    outputPath = path.join(tempDir, `${uniqueId}_output.gif`);

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    console.log(`Converting video to GIF: ${inputPath}`);

    // Convert to GIF
    await convertToGif(inputPath, outputPath, options);

    // If reverse is enabled, create reversed version
    if (options.reverse) {
      reversedPath = path.join(tempDir, `${uniqueId}_reversed.gif`);
      await reverseGif(outputPath, reversedPath);
      
      // Replace output with reversed
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      fs.renameSync(reversedPath, outputPath);
    }

    // Read GIF file
    const gifFile = fs.readFileSync(outputPath);

    // Clean up input file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Return GIF file
    const response = new NextResponse(gifFile, {
      headers: {
        'Content-Type': 'image/gif',
        'Content-Disposition': `attachment; filename="animated.gif"`,
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
    console.error('GIF conversion error:', error);

    // Clean up files on error
    [inputPath, outputPath, reversedPath].forEach(p => {
      if (p && fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
    });

    return NextResponse.json(
      { error: 'GIF conversion failed', details: error.message },
      { status: 500 }
    );
  }
}

function convertToGif(inputPath: string, outputPath: string, options: GifOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const fps = options.fps || 15;
    const width = options.width || 480;

    // Quality settings
    let colors = 256;
    let dither = 'sierra2_4a';

    if (options.quality === 'low') {
      colors = 128;
      dither = 'none';
    } else if (options.quality === 'high') {
      colors = 256;
      dither = 'bayer:bayer_scale=5';
    }

    // Build filter complex for palette generation and GIF creation
    // Use [0:v] to explicitly reference the video stream from input 0
    const filterComplex = `[0:v]fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${colors}[p];[s1][p]paletteuse=dither=${dither}`;

    const args = [
      '-ss', options.startTime.toString(),
      '-t', options.duration.toString(),
      '-i', inputPath,
      '-filter_complex', filterComplex,
      '-loop', options.loop ? '0' : '-1',
      '-y',
      outputPath
    ];

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

function reverseGif(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-vf', 'reverse',
      '-y',
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg reverse exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (error) => {
      reject(error);
    });
  });
}

