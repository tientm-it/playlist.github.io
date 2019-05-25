import React from 'react'
import ReactPlayer from 'react-player'

class ViewVideo extends React.Component {
  state = {
    played: 0,
    playing: true,
    playingIndex: 0,
  }

  onPlay = () => {
    this.setState({ playing: true })
  }

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }

  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }

  onPause = () => {
    this.setState({ playing: false })
  }

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  onEnded = () => {
    this.playNext()
  }

  playNext() {
    const { videos } = this.props
    let nextIndex = this.state.playingIndex + 1
    if (nextIndex >= videos.length) {
      nextIndex = 0
    }
    this.setState({ playingIndex: nextIndex })
    this.props.changeVideo(videos[nextIndex].id, nextIndex)
  }

  playPrevious() {
    const { videos } = this.props
    let nextIndex = this.state.playingIndex - 1
    if (nextIndex < 0) {
      nextIndex = videos.length - 1
    }
    this.setState({ playingIndex: nextIndex })
    this.props.changeVideo(videos[nextIndex].id, nextIndex)
  }

  shuffle() {
    this.props.shuffle()
  }

  ref = player => {
    this.player = player;
  };

  componentWillReceiveProps(nextProps) {
    const { playingVideoIndex } = nextProps
    //console.log("move to selected song", playingVideoIndex);
    if (playingVideoIndex !== this.state.playingIndex) {
      this.setState({ playingIndex: playingVideoIndex })
    }
  }

  render() {
    const { played, playing, playingIndex } = this.state
    const { videos, playingVideoIndex } = this.props
    const video = videos[playingIndex]
    // console.log("=> props.playingVideoIndex", playingVideoIndex);
    // console.log("=> state.playingIndex", playingIndex);

    const playControlStyle = {
      fontSize: '35px',
      color: '#686e71',
      marginRight: '25px',
      cursor: 'pointer',
    }
    const moveControlStyle = {
      fontSize: '28px',
      color: '#686e71',
      marginRight: '25px',
      cursor: 'pointer',
    }

    return (
      <div className="video-page__main-content">
        <div>
          <ReactPlayer
            ref={this.ref}
            url={`https://www.youtube.com/watch?v=${video.id}`}
            width="100%"
            height="400px"
            playing={playing}
            onPlay={this.onPlay}
            onProgress={this.onProgress}
            onPause={this.onPause}
            onEnded={this.onEnded}
          />
        </div>
        <div className="video-page__descr">
          <strong>
            {video.name} - {video.author}
          </strong>
        </div>
        <div className="video-page__player-control-container">
          <div style={{ marginTop: '10px' }}>
            <i className="icmn-shuffle" style={moveControlStyle} onClick={() => this.shuffle()} />
            <i
              className="icmn-previous2"
              onClick={() => this.playPrevious()}
              style={moveControlStyle}
            />
            {playing && (
              <i className="icmn-pause" style={playControlStyle} onClick={() => this.playPause()} />
            )}
            {playing === false && (
              <i className="icmn-play2" style={playControlStyle} onClick={() => this.playPause()} />
            )}

            <i className="icmn-next2" onClick={() => this.playNext()} style={moveControlStyle} />
          </div>

          <input
            className="video-page__player-control-playded"
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={this.onSeekChange}
            onMouseUp={this.onSeekMouseUp}
            onMouseDown={this.onSeekMouseDown}
          />
        </div>
      </div>
    )
  }
}

export default ViewVideo
