import fs from 'fs'
import path from 'path'
import ytdl from 'ytdl-core'

const videoPath = path.resolve().concat('/media/ytb')

const COOKIE = 'YSC=SND1374-uOM; VISITOR_INFO1_LIVE=02gP9MCL1M4; LOGIN_INFO=AFmmF2swRAIgSUb5Z2W02DBJPnm5-qAmVGLj47H3L40dGLI8wcCZg80CICJffhz0soBH_LszMqoh7mLdYvziYxRVNWPNPWgUvulh:QUQ3MjNmeDZUQXRnTl94QzBUV2duT21KTkRUV3R3SE9sOWZ0WE9seTBQVWd0MFJnNnNGdDdEZEdZcHgyeGh5OWJqbGJZTC1ZcnBZSzhOZXE4NTktVGtwSEhCWVRJUGRwUnQzd2M2cFMwZTRyZFcxeTF6YWItQktMbTNEZl84U0lEQ2FKTG1kVDBTeHp6bDZZdElzWk9FZEFLYlhJbHRfRnJn; PREF=tz=America.Fortaleza&f5=20000; SID=JwircoIYCnDweEwaPFNIe8SeKAOKHyT8budcxYcvFyiE8SNaop8XBncluhVy5oqIBAki7w.; __Secure-1PSID=JwircoIYCnDweEwaPFNIe8SeKAOKHyT8budcxYcvFyiE8SNay3nhwMoRVh2slms9-pJTBw.; __Secure-3PSID=JwircoIYCnDweEwaPFNIe8SeKAOKHyT8budcxYcvFyiE8SNaGBURHNnwy5TPuGtfNfin2w.; HSID=AsZXA7ZfS7zQD3P3d; SSID=AMpCKRd0I2Dunp5KB; APISID=oG9i1pawTGjL-zP3/Ar4JD6_iaiV9fer98; SAPISID=-GGpRODKzhMeePYu/AM-ixK78fxoyj6nZt; __Secure-1PAPISID=-GGpRODKzhMeePYu/AM-ixK78fxoyj6nZt; __Secure-3PAPISID=-GGpRODKzhMeePYu/AM-ixK78fxoyj6nZt; SIDCC=AJi4QfF7cKnnx-5tNOG8ruUpCodTrRbAuPAkRlDkyyaQdvzyvHnrZHdv__WnOXaEJsae_mptAbk; __Secure-3PSIDCC=AJi4QfHTX-zTplzIYA55ZE8dfZVf2Jv5dWwAQKrb_XxBBlTorHL2cCfzJnMaa0-GIn8s3YM0uw'
const downloadMp4 = async (videoID, functions) => {
    const video = ytdl(videoID, {
        requestOptions: {
          headers: {
            cookie: COOKIE,
          },
        },
      }).pipe(fs.createWriteStream((`${videoPath}/${videoID}.mp4`)))

    video.on('finish', functions.onFinished)
    video.on('error', functions.onError)
    
}
export default downloadMp4