import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { setLayoutState } from 'ducks/app'
import YouTubeView from './YouTubeView'
import axios from 'axios'
import ReactGA from 'react-ga'
import { API_URL } from '../../../utils/config'

const mapStateToProps = (state, props) => ({
  layoutState: state.app.layoutState,
})

@connect(mapStateToProps)
class YouTubeViewPage extends React.Component {
  state = {
    playplistId: 'PLbBWXuqbWaF2m8U9Pt63fO08ltWijDZtl',
    playlistSettings: null,
  }

  static defaultProps = {
    pathName: 'Playlist',
    roles: ['agent', 'administrator'],
  }

  getPlayplist() {
    axios.get(`${API_URL}/playlists/view?playlistId=${this.state.playplistId}`).then(result => {
      this.setState({ playlistSettings: result.data.settings })
    })
  }

  componentWillMount() {
    // Google analytics
    ReactGA.initialize('UA-140807074-1')
    ReactGA.pageview(window.location.hash)

    const { dispatch } = this.props
    dispatch(setLayoutState({ themeLight: true }))
  }

  componentDidMount() {
    this.getPlayplist()
  }

  render() {
    const props = this.props
    const { playlistSettings, playplistId } = this.state
    return (
      <Page {...props}>
        <Helmet title="Playlist" />
        {playlistSettings && (
          <YouTubeView playlistSettings={playlistSettings} playplistId={playplistId} />
        )}
      </Page>
    )
  }
}

export default YouTubeViewPage
