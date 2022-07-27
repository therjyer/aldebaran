import YoutubeMp3Downloader from "youtube-mp3-downloader";
import path from 'path'





const downloadMp3 = (videoId, functions) => {
    try {
        const youtubeDownloader = new YoutubeMp3Downloader({
            "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
            "outputPath": path.resolve().concat('/media/ytb'),    // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });
        youtubeDownloader.download(videoId, videoId.concat('.mp3'))
        if(functions.onFinished) youtubeDownloader.on("finished", functions.onFinished)
        if(functions.onError) youtubeDownloader.on("error", functions.onError)
    } catch(err) {
        if(functions.onError) functions.onError(err);
        else console.error(err)
    }
}
export {downloadMp3}