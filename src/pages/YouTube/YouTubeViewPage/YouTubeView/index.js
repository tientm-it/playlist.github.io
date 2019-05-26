import React from 'react'
// import MagazineView from './MagazineView'
// import PlaylistView from './PlaylistView'
// import PlayerView from './PlayerView'
import './style.scss'
import axios from 'axios'
import { API_URL } from '../../../../utils/config'
import { shuffleWithPriority, isVideoExisted } from '../../../../utils/ytutil'
import { notification } from 'antd'
import ViewVideo from '../../../../components/LayoutComponents/PlayList/ViewVideo/index'
import ListVideo from '../../../../components/LayoutComponents/PlayList/ListVideo/index'
import { Col, Row } from 'antd'
import ReactGA from 'react-ga'

class YouTubeView extends React.Component {
  state = {
    username: window.localStorage.getItem('app.username'),
    playingVideoIndex: null,
    playingVideoId: null,
    videos: [],
  }

  play = videoId => {
    let videoIndex = 0
    const { videos } = this.state
    for (let i = 0; i <= videos.length; i++) {
      if (videos[i] && videos[i].id === videoId) {
        videoIndex = i
      }
    }
    this.setState({ playingVideoId: videoId, playingVideoIndex: videoIndex })
  }

  changeVideo = (videoId, videoIndex) => {
    // console.log(`vidoe change: videoId=${videoId} index: ${videoIndex}`)
    ReactGA.pageview(`${window.location.hash}/changeVideo`)
    this.setState({ playingVideoId: videoId, playingVideoIndex: videoIndex })
  }

  addVideo = video => {
    let currentList = this.state.videos
    // prevent duplicate
    const oldVideo = currentList.find(v => v.id === video.id)
    if (!oldVideo) {
      ReactGA.pageview(`${window.location.hash}/addVideo`)
      currentList.push(video)
      this.setState({ videos: currentList })
    }
  }

  removeVideo = videoId => {
    let currentList = this.state.videos.filter(video => {
      return video.id !== videoId
    })
    this.setState({ videos: currentList })
    ReactGA.pageview(`${window.location.hash}/removeVideo`)
  }

  shuffleVideos = () => {
    const { videos, playingVideoId } = this.state
    let currentList = shuffleWithPriority(this.props.playlistSettings.lowPriorityReportNum, videos)
    //keep the playing song at the top
    const playingVideoArr = currentList.filter(v => {
      return v.id === playingVideoId
    })
    const playingVideo = playingVideoArr[0]

    currentList = currentList.filter(v => {
      return v.id !== playingVideoId
    })
    currentList.unshift(playingVideo)

    this.setState({ playingVideoIndex: 0, videos: currentList })
  }

  getVideos = () => {
    axios.get(`${API_URL}/videos/list?playlistId=${this.props.playplistId}`).then(result => {
      let tempVideos = []
      let tempVideoIds = []
      Object.entries(result.data).forEach(entry => {
        tempVideos.push(entry[1])
        tempVideoIds.push(entry[1].id)
      })

      const shuffVideos = shuffleWithPriority(
        this.props.playlistSettings.lowPriorityReportNum,
        tempVideos,
      )
      this.setState({
        videos: shuffVideos,
        playingVideoIndex: 0,
        playingVideoId: shuffVideos[0].id,
      })
    })
  }

  onNewVideo = newVideo => {
    const { playlistSettings } = this.props
    this.addVideo(newVideo)
    // shuffle the list if videoAddedShuffle = true
    if (playlistSettings && playlistSettings.videoAddedShuffle) {
      // console.log('===> videoAddedShuffle = true')
      this.shuffleVideos()
    }

    notification.open({
      type: 'info',
      message: `New video [${newVideo.name}] has just added by ${
        newVideo.requester
      } into the playlist!`,
    })
  }

  componentWillUnmount() {
    this.firebaseRef.off()
  }

  componentWillMount() {
    // Google analytics
    ReactGA.initialize('UA-140807074-1')
    ReactGA.pageview(window.location.hash)

    this.getVideos()

    const { playplistId } = this.props

    // eslint-disable-next-line no-undef
    this.firebaseRef = new Firebase('https://cherryshop-82f74.firebaseio.com/videos')
    this.firebaseRef.on(
      'child_changed',
      function(dataSnapshot) {
        const newVideo = dataSnapshot.val()

        // check add new or remove video from playlist
        if (!newVideo.playlists || !newVideo.playlists[playplistId]) {
          if (newVideo.requester !== this.state.username) {
            this.removeVideo(newVideo.id)

            notification.open({
              type: 'info',
              message: `The video [${newVideo.name}] has just deleted by ${
                newVideo.requester
              } from the playlist!`,
            })
          }
        } else {
          if (newVideo.requester !== this.state.username) {
            // add if not existing
            if (!isVideoExisted(newVideo.id, this.state.videos)) {
              this.onNewVideo(newVideo)
            }
          }
        }
      }.bind(this),
    )

    this.firebaseRef.on(
      'child_added',
      function(dataSnapshot) {
        const newVideo = dataSnapshot.val()
        if (newVideo.playlists && newVideo.playlists[playplistId]) {
          if (!isVideoExisted(newVideo.id, this.state.videos)) {
            // console.log('new video', newVideo)
            this.onNewVideo(newVideo)
          } else {
            // console.log('existed', newVideo.id)
          }
        }
      }.bind(this),
    )
  }

  render() {
    const { playingVideoId, playingVideoIndex, videos } = this.state
    return (
      <section className="card">
        <div className="card-header">
          <div className="utils__title">
            <strong>Grande team - playlist</strong>
          </div>
        </div>
        <div className="card-body">
          <div className="video-page clearfix">
            <Row>
              <Col xs={24} sm={24} md={24} lg={12} xl={14}>
                {playingVideoIndex !== null && (
                  <ViewVideo
                    playingVideoIndex={playingVideoIndex}
                    videos={videos}
                    changeVideo={this.changeVideo}
                    shuffle={this.shuffleVideos}
                  />
                )}
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                {playingVideoIndex !== null && (
                  <ListVideo
                    playplistId={this.props.playplistId}
                    play={this.play}
                    playingVideoId={playingVideoId}
                    playlistSettings={this.props.playlistSettings}
                    videos={videos}
                    addVideo={this.addVideo}
                    removeVideo={this.removeVideo}
                    getVideos={this.getVideos}
                  />
                )}
              </Col>
            </Row>
            ,
          </div>
        </div>
      </section>
    )
  }
}

export default YouTubeView
