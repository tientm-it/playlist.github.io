import React from 'react'
import { Col, Row, notification } from 'antd'
import { connect } from 'react-redux'
import { setLayoutState } from 'ducks/app'
import ReactGA from 'react-ga'

import ParticleComponent from 'components/ParticleBackground'
import VideoPlayer from 'components/VideoPlayer'
import Page from 'components/LayoutComponents/Page'
import { shuffleWithPriority, isVideoExisted } from 'utils/ytutil'

import ListVideo from './ListVideo'
import { getSetting, getVideos, countPlayChange, deleteVideo } from './apis'

import 'video.js/dist/video-js.css'
import './style.scss'

const mapStateToProps = (state, props) => ({
  layoutState: state.app.layoutState,
})

@connect(mapStateToProps)
class PlayList extends React.Component {
  static defaultProps = {
    pathName: 'test',
    roles: ['agent', 'administrator'],
    username: window.localStorage.getItem('app.username'),
    playplistId: 'PLbBWXuqbWaF2m8U9Pt63fO08ltWijDZtl',
  }

  state = {
    playlistSettings: null,
    currentPlaying: {},
    playlist: [],
  }

  componentWillMount = async () => {
    // Google analytics
    ReactGA.initialize('UA-140807074-1')
    ReactGA.pageview(window.location.hash)

    const { username, playplistId, dispatch } = this.props
    dispatch(setLayoutState({ themeLight: false }))

    const settingRes = await getSetting(playplistId)
    const playlist = await getVideos(playplistId, settingRes.settings)
    if (playlist) {
      countPlayChange(playlist[0].id)
      playlist[0].countPlay += 1
    }
    this.setState({
      playlist: playlist.map(song => ({ ...song, my: song.requester === username })),
      currentPlaying: playlist ? playlist[0] || {} : {},
      playlistSettings: { ...settingRes.settings },
    })

    // eslint-disable-next-line no-undef
    this.firebaseRef = new Firebase('https://playlistcontrol-224115.firebaseio.com/videos')
    this.firebaseRef.on(
      'child_changed',
      function(dataSnapshot) {
        const newVideo = dataSnapshot.val()

        // check add new or remove video from playlist
        if (!newVideo.playlists || !newVideo.playlists[playplistId]) {
          if (newVideo.requester !== this.props.username) {
            this.removeVideo(newVideo.id)

            notification.open({
              type: 'info',
              message: `The video [${newVideo.name}] has just deleted by ${
                newVideo.requester
              } from the playlist!`,
            })
          }
        } else {
          if (newVideo.requester !== this.props.username) {
            // add if not existing
            if (!isVideoExisted(newVideo.id, this.state.playlist)) {
              this.onNewVideo(newVideo)
            }
          }
          // update count play, like,...
          this.onUpdateVideo(newVideo)
        }
      }.bind(this),
    )

    this.firebaseRef.on(
      'child_added',
      function(dataSnapshot) {
        const newVideo = dataSnapshot.val()
        if (newVideo.playlists && newVideo.playlists[playplistId]) {
          if (!isVideoExisted(newVideo.id, this.state.playlist)) {
            // console.log('new video', newVideo)
            this.onNewVideo(newVideo)
          }
        }
      }.bind(this),
    )
  }

  componentWillUnmount() {
    this.firebaseRef.off()
  }

  onNewVideo = newVideo => {
    const { playlistSettings } = this.props
    this.addVideo(newVideo)
    // shuffle the list if videoAddedShuffle = true
    if (playlistSettings && playlistSettings.videoAddedShuffle) {
      // console.log('===> videoAddedShuffle = true')
      this.handleShuffle()
    }

    notification.open({
      type: 'info',
      message: `New video [${newVideo.name}] has just added by ${
        newVideo.requester
      } into the playlist!`,
    })
  }

  onUpdateVideo = newVideo => {
    const { playlist, currentPlaying } = this.state
    // prevent duplicate
    const newList = []
    playlist.forEach(song => {
      if (song.id === newVideo.id) {
        newList.push(newVideo)
      } else {
        newList.push(song)
      }
    })
    let newCurrent = currentPlaying
    if (newVideo.id === currentPlaying.id) {
      newCurrent = newVideo
    }
    this.setState({
      playlist: newList,
      currentPlaying: newCurrent,
    })
  }

  addVideo = video => {
    const { playlist } = this.state
    // prevent duplicate
    const oldVideo = playlist.find(v => v.id === video.id)
    if (!oldVideo) {
      playlist.push(video)
      this.setState({ playlist })
    }
  }

  removeVideo = videoId => {
    deleteVideo(videoId, this.props.playplistId, result => {
      if (result) {
        let currentList = this.state.playlist.filter(video => {
          return video.id !== videoId
        })
        this.setState({ playlist: currentList })

        notification.open({
          type: 'success',
          message: 'Video is removed from the playlist!',
        })
      } else {
        notification.open({
          type: 'error',
          message: 'Some thing error!',
        })
      }
    })
  }

  handleSongError = message => {
    const { currentPlaying } = this.state
    notification.warning({
      message: currentPlaying.name,
      description: message,
    })

    this.handleNextSong()
  }

  handleNextSong = () => {
    const { playlist, currentPlaying } = this.state
    let idx = playlist.map(song => song.id).indexOf(currentPlaying.id) + 1
    if (idx === playlist.length) {
      idx = 0
    }
    this.handleChangeSong(playlist[idx])
  }

  handleChangeSong = songInfo => {
    const { currentPlaying } = this.state

    if (currentPlaying.id !== songInfo.id) {
      this.setState({
        currentPlaying: songInfo,
      })
      countPlayChange(songInfo.id)
    }
  }

  handleShuffle = () => {
    const { playlistSettings, playlist } = this.state
    const shuffledPlaylist = shuffleWithPriority(playlistSettings.lowPriorityReportNum, playlist)

    this.setState({
      playlist: shuffledPlaylist,
    })
  }

  render() {
    const { username } = this.props
    const { currentPlaying, playlist } = this.state
    const data = playlist.map(song => {
      song.my = song.requester === username
      song.playing = song.id === currentPlaying.id
      return song
    })

    return (
      <Page {...this.props} style={{ padding: 0 }}>
        <div className="playlist">
          <ParticleComponent />
          <Row className="playlist__wapper">
            <Col xs={24} sm={24} md={24} lg={14} xl={14} style={{ padding: '10px' }}>
              <VideoPlayer
                videoId={currentPlaying.id}
                nextSong={this.handleNextSong}
                errorSong={this.handleSongError}
              />
              <div>{currentPlaying.name}</div>
              <div>{currentPlaying.countPlay} Views</div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ padding: '10px' }}>
              <ListVideo
                listSong={data}
                changeSong={this.handleChangeSong}
                shuffleSong={this.handleShuffle}
                addSong={this.addVideo}
                removeSong={this.removeVideo}
              />
            </Col>
          </Row>
        </div>
      </Page>
    )
  }
}

export default PlayList
