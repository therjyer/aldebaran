import search from 'youtube-search';

const options = {
    maxResults: 5,
    key: process.env.YOUTUBE_SEARCH_KEY
};

const searchVideosMessageGlobal = 'Os videos que encontrei são esses:'

const searchVideo = async (args) => {
   const videoName = args.slice(1).join(' ')
   let  searchVideosMessage = 'Os videos que encontrei são esses:\n '
   const response = await search(videoName, options)
   response.results.forEach((video, index) => {
        searchVideosMessage = searchVideosMessage.concat(`${index+1} - Titulo: ${video.title} Link: ${video.link}\n`) 
   });

   return searchVideosMessage
}

const getVideoId = async (args, quotedMsg ) => {
    const searchString = args.slice(1).join(' ')
    if(searchString.includes('youtube')) return searchString.split('=')[1]
    else return handlerQuotedMsg(args, quotedMsg, searchString)
}

const handlerQuotedMsg = async (args, quotedMsg, searchString) => {
    let searchListNumber = searchString.toString();
    try {
        searchListNumber = parseInt(args[1])
    } catch (error) {
        console.error(error)
    }
    const opts = {maxResults: 1,key: process.env.YOUTUBE_SEARCH_KEY}
    if(quotedMsg && quotedMsg?.text.includes(searchVideosMessageGlobal) && typeof searchListNumber === 'number') {
        if(searchListNumber >= 1 && searchListNumber <= 5) {
            const foundVideos = quotedMsg.text.split('\n')
            const videoLink = foundVideos[searchListNumber].split('Link: ')[1]
            return videoLink.split('=')[1]
        }
    }
    else {
        const searchResponse = await search(searchString, opts)
        if(searchResponse.results.length > 0) return searchResponse.results[0].id
        return null
    }

}

export {getVideoId, searchVideo}