import React from "react";
import Page from "components/LayoutComponents/Page";
import Helmet from "react-helmet";
import YouTubeView from "./YouTubeView";
import axios from "axios";
import { API_URL } from "../../../utils/config";

class YouTubeViewPage extends React.Component {
  state = {
    playplistId: "2053363501372723",
    playlistSettings: null
  };

  static defaultProps = {
    pathName: "Playlist",
    roles: ["agent", "administrator"]
  };

  getPlayplist() {
    axios.get(`${API_URL}/playlists/view?playlistId=${this.state.playplistId}`).then(result => {
      this.setState({ playlistSettings: result.data.settings });
    });
  }

  componentDidMount() {
    this.getPlayplist();
  }

  render() {
    const props = this.props;
    const { playlistSettings, playplistId } = this.state;
    return (
      <Page {...props}>
        <Helmet title="Playlist" />
        {playlistSettings && <YouTubeView playlistSettings={playlistSettings} playplistId={playplistId} />}
      </Page>
    );
  }
}

export default YouTubeViewPage;
