# GarTools - Media Processing Toolkit

A modern, production-ready web application for processing, converting, and enhancing media files. Built with Next.js, TypeScript, and containerized with Docker.

## Features

- 🎵 Audio Enhancer - Improve audio quality with normalization and noise reduction
- 🎬 Video to GIF Converter - Convert video segments to animated GIFs
- 📦 Batch Converter - Convert multiple files simultaneously
- 🗜️ Video Compressor - Compress videos with platform-specific presets
- ✏️ Metadata Editor - Edit audio and video metadata, tags, and cover art
- 🎼 Music Identifier - Identify songs from audio files
- 📝 AI Transcription - Convert speech to text with high accuracy
- 🌐 AI Translation - Translate subtitles between languages
- 📊 Analytics Dashboard - Track usage statistics and processing history
- 🎨 Modern, responsive UI with professional design
- ⚡ Fast processing with optimized pipelines
- 🐳 Fully containerized with Docker
- 🔒 Production-ready with error handling
- 📱 Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Media Processing**: fluent-ffmpeg, music-metadata, node-id3
- **AI Services**: OpenAI Whisper, Google Cloud Translation
- **Database & Auth**: Supabase
- **Payments**: Stripe
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- FFmpeg (automatically installed in Docker)

## Getting Started

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install FFmpeg** (required for media processing):
   - **macOS**: `brew install ffmpeg`
   - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Build and Run with Docker Compose

1. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000)

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

#### Build Docker Image Manually

```bash
docker build -t fgarola-tools .
docker run -p 3000:3000 fgarola-tools
```

## Publishing to Docker Hub

### Step 1: Build the Image

```bash
docker build -t your-dockerhub-username/fgarola-tools:latest .
```

### Step 2: Tag the Image (Optional - for versioning)

```bash
docker tag your-dockerhub-username/fgarola-tools:latest your-dockerhub-username/fgarola-tools:v1.0.0
```

### Step 3: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### Step 4: Push to Docker Hub

```bash
docker push your-dockerhub-username/fgarola-tools:latest
docker push your-dockerhub-username/fgarola-tools:v1.0.0
```

### Step 5: Pull and Run from Docker Hub

Anyone can now pull and run your image:

```bash
docker pull your-dockerhub-username/fgarola-tools:latest
docker run -p 3000:3000 your-dockerhub-username/fgarola-tools:latest
```

## Usage

1. **Enter external platforms URL**: Paste a valid external platforms video URL
2. **Select Format**: Choose between MP4 (video) or MP3 (audio)
3. **Click Process**: Wait for processing to complete
4. **Process File**: Click the process button to save the file

## Project Structure

```
fgarola-tools/
├── app/
│   ├── api/
│   │   └── process/
│   │       └── route.ts          # API endpoint for video processing
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── public/                       # Static assets
├── temp/                         # Temporary process files (auto-created)
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── .dockerignore                 # Docker ignore file
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Environment Variables

The application works out of the box without additional environment variables. Optional configurations:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `FFMPEG_PATH`: Custom FFmpeg binary path (auto-detected in Docker)

## Docker Image Details

- **Base Image**: node:20-alpine
- **Size**: ~500MB (optimized with multi-stage build)
- **Includes**: Node.js, FFmpeg, yt-dlp, Python3
- **Architecture**: Multi-stage build for optimal size
- **User**: Runs as non-root user for security

## Security Considerations

- Runs as non-root user in Docker
- Input validation for URLs
- Temporary files are cleaned up after processing
- No sensitive data stored
- CORS and security headers configured

## Limitations

- For personal use only
- Respect external platforms's Terms of Service
- Respect copyright laws
- Some videos may be restricted or unavailable
- Large files may take time to process

## Troubleshooting

### FFmpeg not found
- **Local**: Install FFmpeg on your system
- **Docker**: FFmpeg is automatically installed in the container

### Process fails
- Check if the external platforms URL is valid and accessible
- Some videos may be geo-restricted or private
- Ensure you have a stable internet connection

### Container won't start
- Check if port 3000 is already in use
- Verify Docker is running
- Check Docker logs: `docker logs fgarola-tools`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes only. Please respect external platforms's Terms of Service and copyright laws.

## Disclaimer

This tool is for personal use only. The developers are not responsible for any misuse of this application. Always respect copyright laws and external platforms's Terms of Service.
