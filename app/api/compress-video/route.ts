import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface CompressionOptions {
  preset?: 'web' | 'instagram' | 'tiktok' | 'twitter' | 'custom';
  quality?: 'low' | 'medium' | 'high';
  bitrate?: string; // e.g., '1M', '2M'
  resolution?: string; // e.g., '1920x1080', '1280x720'
  fps?: number;
}

const tempDir = path.join(process.cwd(), 'temp');

// Platform presets
const PRESETS = {
  web: {
    resolution: '1920x1080',
    bitrate: '8M',
    fps: 30,
    quality: 'high' as const,
  },
  instagram: {
    resolution: '1080x1350',
    bitrate: '3.5M',
    fps: 30,
    quality: 'medium' as const,
  },
  tiktok: {
    resolution: '1080x1920',
    bitrate: '2M',
    fps: 30,
    quality: 'medium' as const,
  },
  twitter: {
    resolution: '1280x720',
    bitrate: '2M',
    fps: 30,
    quality: 'medium' as const,
  },
};

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

    let options: CompressionOptions = optionsStr ? JSON.parse(optionsStr) : {
      quality: 'medium',
    };

    // Apply preset if specified
    if (options.preset && options.preset !== 'custom') {
      options = { ...options, ...PRESETS[options.preset] };
    }

    // Generate unique filenames
    const uniqueId = uuidv4();
    const inputExt = file.name.split('.').pop() || 'mp4';
    inputPath = path.join(tempDir, `${uniqueId}_input.${inputExt}`);
    outputPath = path.join(tempDir, `${uniqueId}_compressed.mp4`);

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    console.log(`Compressing video: ${inputPath}`);
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    // Compress video
    await compressVideo(inputPath, outputPath, options);

    // Get compressed file size
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    console.log(`Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compression ratio: ${compressionRatio}%`);

    // Read compressed file
    const compressedFile = fs.readFileSync(outputPath);

    // Clean up input file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Return compressed file with metadata
    const response = new NextResponse(compressedFile, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="compressed_${file.name}"`,
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Compression-Ratio': compressionRatio,
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
    console.error('Video compression error:', error);

    // Clean up files on error
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return NextResponse.json(
      { error: 'Video compression failed', details: error.message },
      { status: 500 }
    );
  }
}

function compressVideo(inputPath: string, outputPath: string, options: CompressionOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['-i', inputPath];

    // Video codec
    args.push('-c:v', 'libx264');

    // Preset for encoding speed vs compression
    let preset = 'medium';
    if (options.quality === 'low') {
      preset = 'veryfast';
    } else if (options.quality === 'high') {
      preset = 'slow';
    }
    args.push('-preset', preset);

    // CRF (Constant Rate Factor) for quality
    let crf = '23'; // default
    if (options.quality === 'low') {
      crf = '28';
    } else if (options.quality === 'high') {
      crf = '18';
    }
    args.push('-crf', crf);

    // Bitrate (if specified)
    if (options.bitrate) {
      args.push('-b:v', options.bitrate);
    }

    // Resolution (if specified)
    if (options.resolution) {
      args.push('-vf', `scale=${options.resolution}`);
    }

    // FPS (if specified)
    if (options.fps) {
      args.push('-r', options.fps.toString());
    }

    // Audio codec
    args.push('-c:a', 'aac');
    args.push('-b:a', '128k');

    // Output
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
