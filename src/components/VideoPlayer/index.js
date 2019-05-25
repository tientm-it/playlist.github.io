import React from 'react'
import videojs from 'video.js'
import { Icon } from 'antd'

import 'videojs-youtube'

import 'video.js/dist/video-js.css'
import './style.scss'

class VideoPlayer extends React.Component {
  componentDidMount = () => {
    const { videoId, nextSong, errorSong } = this.props

    var vjsButtonComponent = videojs.getComponent('Button')
    videojs.registerComponent(
      'NextTrack',
      videojs.extend(vjsButtonComponent, {
        constructor: function() {
          vjsButtonComponent.apply(this, arguments)
        },
        handleClick: function() {
          nextSong()
        },
        buildCSSClass: function() {
          return 'vjs-control vjs-next-track-button'
        },
      }),
    )
    // instantiate Video.js
    const options = this.videoJsOptions(videoId)
    this.player = videojs(this.videoNode, options, function onPlayerReady() {
      this.on('ended', () => {
        setTimeout(nextSong(), 2000)
      })
      this.on('error', error => {
        console.log(this)
        console.log(this.error_.message)
        setTimeout(errorSong(this.error_.message), 2000)
      })
      this.getChild('controlBar').addChild('NextTrack', {}, 1)

      console.log(this)
    })
  }

  // destroy player on unmount
  componentWillUnmount = () => {
    if (this.player) {
      this.player.dispose()
    }
  }

  // videojs options
  videoJsOptions = videoId => ({
    autoplay: true,
    fluid: true,
    controls: true,
    techOrder: ['youtube'],
    sources: [
      {
        type: 'video/youtube',
        src: `https://www.youtube.com/watch?v=${videoId}&rel=0&showinfo=1`,
      },
    ],
    youtube: {
      ytControls: 0,
    },
    techCanOverridePoster: true,
    playbackRates: [0.5, 1, 1.5, 2],
    nativeTextTracks: true,
    errorDisplay: false,
    currentTimeDisplay: true,
  })

  shouldComponentUpdate = nextProps => nextProps.videoId !== this.props.videoId

  componentDidUpdate = () => {
    this.player.src({
      type: 'video/youtube',
      src: `https://www.youtube.com/watch?v=${this.props.videoId}&rel=0&showinfo=1`,
    })
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div className="video-player">
        <div data-vjs-player>
          <video ref={node => (this.videoNode = node)} className="video-js" />
        </div>
      </div>
    )
  }
}

export default VideoPlayer
