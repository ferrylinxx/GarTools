# Quick Start Guide

Get the external platforms Toolkit up and running in minutes!

## Option 1: Docker (Recommended - Easiest)

### Prerequisites
- Docker installed on your machine

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd fgarola-tools
   ```

2. **Build and start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   Open your browser and go to: `http://localhost:3000`

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

That's it! All dependencies (Node.js, FFmpeg, yt-dlp) are included in the Docker image.

## Option 2: Local Development

### Prerequisites
- Node.js 20 or higher
- FFmpeg installed on your system

### Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Process from [ffmpeg.org](https://ffmpeg.org/process.html) and add to PATH

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd fgarola-tools
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and go to: `http://localhost:3000`

## How to Use

1. **Paste a external platforms URL** into the input field
   - Example: `https://www.external.com/watch?v=dQw4w9WgXcQ`

2. **Select the format:**
   - **MP4** for video with audio
   - **MP3** for audio only

3. **Click "Process"** and wait for processing

4. **Click "Process File"** when ready to save the file

## Publishing to Docker Hub

### Quick Steps

1. **Build the image:**
   ```bash
   docker build -t your-username/fgarola-tools:latest .
   ```

2. **Login to Docker Hub:**
   ```bash
   docker login
   ```

3. **Push to Docker Hub:**
   ```bash
   docker push your-username/fgarola-tools:latest
   ```

4. **Share with others:**
   ```bash
   docker pull your-username/fgarola-tools:latest
   docker run -p 3000:3000 your-username/fgarola-tools:latest
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Troubleshooting

### "FFmpeg not found" error
- **Docker**: FFmpeg is automatically installed
- **Local**: Make sure FFmpeg is installed and in your PATH

### Port 3000 already in use
```bash
# Use a different port
docker run -p 8080:3000 fgarola-tools
# Then access at http://localhost:8080
```

### Build fails
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for cloud deployment options
- Customize the UI in `app/page.tsx`
- Modify API logic in `app/api/process/route.ts`

## Support

For issues and questions, please check the documentation or create an issue on GitHub.

## Important Notes

⚠️ **Legal Notice**: This tool is for personal use only. Always respect:
- external platforms's Terms of Service
- Copyright laws
- Content creators' rights

Use responsibly and ethically!

