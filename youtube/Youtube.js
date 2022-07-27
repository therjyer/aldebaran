import YTSearch from 'youtube-search';
import YoutubeMp3Downloader from "youtube-mp3-downloader";
const downloaderOptions = {
    "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location 
    "outputPath": "../media/ytb",         // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 10,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
}// Additional output options passend to ffmpeg

//"outputPath": "../media/ytb",
class YoutubeDownloader {
    constructor(key) {
        this.key = key;
        this.searchString = '';
        this.nextPageToken = '';
        this.previousPageToken = '';
        this.videos = [];
    }

    getNextPage(){
        return this.getResults(this.searchString, this.nextPageToken);
    }
    getPreviousPage(){
        return this.getResults(this.searchString, this.previousPageToken);
    }
    getCachedResults(){
        return this.videos;
    }

    async getResults(searchString, pageToken, maxResults = 5){
        const options = { maxResults, key: this.key, pageToken };
        const response = await YTSearch(searchString, options);
    
        this.searchString = searchString;
        this.videos = response.results;
        this.nextPageToken = response?.pageInfo.nextPageToken;
        this.previousPageToken = response?.pageInfo.prevPageToken;

        return response.results.map((result, index) => ({
            link: result.link,
            title: result.title,
            index, 
        }));
    }

    async downloadVideoFromUrl(videoUrl, options = {}){
        try {
            const YD = new YoutubeMp3Downloader(downloaderOptions);
            const ID_VIDEO = videoUrl.split('=')[1];

            console.log("BAIXANDO VIDEO DE ID = ", ID_VIDEO);
            console.log("video", videoUrl)

            YD.download("EF889gHjZu8", 'teste.mp3');

            YD.on("progress", function(progress) {
                console.log(progress);
				console.log(JSON.stringify(progress));
			});
            YD.on("finished",  function(err, data) {
				console.log('err', err)
				console.log('data', data)
			});
    
            YD.on("error",  ((error) => {
                console.error(error);
                throw error;
            }));

            YD.on("error", function (error) {
                client.reply(from, `Deu merda veii, mostra isso para o Kauã:\n ${error}`, id);
                console.log(error);
            });

            YD.on("queueSize", function(size) {
                console.log(size);
            });

            return `Achei teu video, to baixando já`;
        } catch (e) {
            console.error(e);
            return "deu merda, se liga: " + e;
        }
    }

    async downloadFirstResult(searchString, options){
        const response = await this.getResults(searchString);
        console.log(response[0])
        return this.downloadVideoFromUrl(response[0].link, options);
    }

    async downloadFromIndex(index, options){
        console.log(this.videos);
        const safeIndex = parseInt(index);
        return this.downloadVideoFromUrl(this.videos[safeIndex -1].link, options);
    }
}



export default YoutubeDownloader;