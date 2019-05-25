import axios from "axios";

import { API_URL } from "utils/config";
import { shuffleWithPriority } from "utils/ytutil";

export const getSetting = (playplistId) => (
  axios.get(`${API_URL}/playlists/view?playlistId=${playplistId}`)
  .then(result => {
    return result.data;
  })
  .catch(error => {
    return {
      settings: {
        lowPriorityReportNum: 3,
        maxAge: 5,
        maxSongsPerUser: 3,
        maxVideoLen: 300,
        videoAddedShuffle: true,
      }
    };
  })
)

export const getVideos = (playplistId, videoSettings) => (
  axios.get(`${API_URL}/videos/list?playlistId=${playplistId}`)
  .then(result => {
    let tempVideos = [];
    let tempVideoIds = [];
    Object.entries(result.data).forEach(entry => {
      tempVideos.push(entry[1]);
      tempVideoIds.push(entry[1].id);
    });

    const shuffVideos = shuffleWithPriority(videoSettings.lowPriorityReportNum, tempVideos);
    return shuffVideos;
  })
  .catch(error => {
    return [];
  })
);

export const countPlayChange = (videoId) => {
  axios.get(`${API_URL}/videos/countPlay?videoId=${videoId}`)
  .then(result => {
    console.log(result)
  })
  .catch(error => {
    return [];
  })
}

// export const countPlayChange = (videoId) => {
//   axios.get(`${API_URL}/videos/countPlay?videoId=${videoId}`)
//   .then(result => {
//     console.log(result)
//   })
//   .catch(error => {
//     return [];
//   })
// }

export const deleteVideo = (videoId, playplistId, callback) => {
  axios.get(`${API_URL}/videos/remove?videoId=${videoId}&playlistId=${playplistId}`)
  .then(res => {
    if (res.data && callback) {
      callback(true);
    }
  })
  .catch(error => {
    if (callback) {
      callback(false);
    }
  });
}