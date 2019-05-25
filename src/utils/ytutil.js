import { notification } from 'antd'
import axios from 'axios'
import { API_KEY } from './config'

const MATCH_START_STAMP = /(\d+)(h|m|s)/g

function parseTimeString(stamp) {
  // PT4M46S
  let seconds = 0
  let array = MATCH_START_STAMP.exec(stamp.toLowerCase())

  while (array !== null) {
    const [, count, period] = array
    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = MATCH_START_STAMP.exec(stamp)
  }
  return seconds
}

function presentTime(seconds) {
  let date = new Date(null)
  date.setSeconds(seconds) // specify value for SECONDS here
  return date.toISOString().substr(14, 5)
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const shuffleWithPriority = (lowPriorityReportNum, videos) => {
  let normalVideos = []
  let lowPriorityVideos = []
  let shuffVideos = []

  for (let i = 0; i < videos.length; i++) {
    if (videos[i].reporters && Object.keys(videos[i].reporters).length >= lowPriorityReportNum) {
      lowPriorityVideos.push(videos[i])
    } else {
      normalVideos.push(videos[i])
    }
  }

  const halfLen = Math.round(videos.length / 2)
  if (lowPriorityVideos.length > 0 && normalVideos.length > halfLen) {
    // console.log("====> low priority calculation happens");
    normalVideos = shuffle(normalVideos)
    lowPriorityVideos = lowPriorityVideos.concat(normalVideos.slice(halfLen))
    normalVideos = normalVideos.slice(0, halfLen)

    shuffVideos = shuffle(normalVideos)
    lowPriorityVideos = shuffle(lowPriorityVideos)
    shuffVideos = shuffVideos.concat(lowPriorityVideos)
  } else {
    // console.log("====> normal calculation happens");
    shuffVideos = shuffle(normalVideos)
    lowPriorityVideos = shuffle(lowPriorityVideos)
    shuffVideos = shuffVideos.concat(lowPriorityVideos)
  }

  return shuffVideos
}

const isVideoExisted = (videoId, videos) => {
  const tempVideos = videos.filter(v => {
    return v.id === videoId
  })
  if (tempVideos && tempVideos.length > 0) {
    return true
  }
  return false
}

async function getVideoDetail(videoId) {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`,
  )
  const { data } = await res
  return data
}

const validateAddContrainst = async (username, videoId, videos, playlistSettings) => {
  // check video existence
  let filteredVideos = videos.filter(v => {
    return v.id === videoId
  })
  if (filteredVideos.length > 0) {
    notification.open({
      type: 'warning',
      message: 'This video has already added into the playlist!',
    })
    return false
  }

  filteredVideos = videos.filter(v => {
    return v.requester === username
  })

  if (filteredVideos.length >= playlistSettings.maxSongsPerUser) {
    notification.open({
      type: 'warning',
      message: 'You are out of quotation for adding new video, please remove existing videos!',
    })
    return false
  }

  const videoData = await getVideoDetail(videoId)
  if (videoData.items && videoData.items.length > 0) {
    const videoDetails = videoData.items[0]
    // get duration
    const duration = parseTimeString(videoDetails.contentDetails.duration)
    if (duration > playlistSettings.maxVideoLen) {
      notification.open({
        type: 'warning',
        message: "Video's length is exceded 5 mins, please select another shorter video!",
      })
      return false
    }
  } else {
    notification.open({
      type: 'warning',
      message: "Video's Id is invalid from youtube, please check again!",
    })
    return false
  }

  return true
}

export {
  parseTimeString,
  presentTime,
  shuffle,
  validateAddContrainst,
  shuffleWithPriority,
  isVideoExisted,
}
