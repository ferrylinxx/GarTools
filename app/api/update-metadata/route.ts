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
  let artworkPath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string;

    if (!file || !metadataStr) {
      return NextResponse.json({ error: 'Missing file or metadata' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataStr);

    // Generate unique filenames
    const uniqueId = uuidv4();
    const fileExt = file.name.split('.').pop() || 'mp3';
    inputPath = path.join(tempDir, `${uniqueId}_input.${fileExt}`);
    outputPath = path.join(tempDir, `${uniqueId}_output.${fileExt}`);

    // Save uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(inputPath, buffer);

    // Handle artwork if provided
    if (metadata.artwork && metadata.artwork.startsWith('data:image')) {
      artworkPath = path.join(tempDir, `${uniqueId}_artwork.jpg`);
      const base64Data = metadata.artwork.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(artworkPath, Buffer.from(base64Data, 'base64'));
    }

    console.log(`Updating metadata for ${inputPath}...`);

    // Update metadata using ffmpeg
    await updateMetadata(inputPath, outputPath, metadata, artworkPath);

    // Read updated file
    const updatedFile = fs.readFileSync(outputPath);

    // Clean up files
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (artworkPath && fs.existsSync(artworkPath)) fs.unlinkSync(artworkPath);

    // Determine MIME type
    const mimeType = getMimeType(fileExt);

    // Return updated file
    const response = new NextResponse(updatedFile, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${file.name}"`,
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
    console.error('Metadata update error:', error);

    // Clean up files on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    if (artworkPath && fs.existsSync(artworkPath)) fs.unlinkSync(artworkPath);

    return NextResponse.json(
      { error: 'Failed to update metadata', details: error.message },
      { status: 500 }
    );
  }
}

function updateMetadata(
  inputPath: string,
  outputPath: string,
  metadata: any,
  artworkPath?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      '-i', inputPath,
      '-y', // Overwrite output file
    ];

    // Add artwork if provided
    if (artworkPath && fs.existsSync(artworkPath)) {
      args.push('-i', artworkPath);
      args.push('-map', '0:a');
      args.push('-map', '1:0');
      args.push('-c', 'copy');
      args.push('-id3v2_version', '3');
      args.push('-metadata:s:v', 'title=Album cover');
      args.push('-metadata:s:v', 'comment=Cover (front)');
    } else {
      args.push('-c', 'copy');
    }

    // Add metadata tags
    if (metadata.title) args.push('-metadata', `title=${metadata.title}`);
    if (metadata.artist) args.push('-metadata', `artist=${metadata.artist}`);
    if (metadata.album) args.push('-metadata', `album=${metadata.album}`);
    if (metadata.year) args.push('-metadata', `date=${metadata.year}`);
    if (metadata.genre) args.push('-metadata', `genre=${metadata.genre}`);

    args.push(outputPath);

    const ffmpeg = spawn('ffmpeg', args);

    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('FFmpeg:', data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('Metadata updated successfully');
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

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
  };

  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

