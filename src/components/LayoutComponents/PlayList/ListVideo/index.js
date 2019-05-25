import React from "react";
import { Input, Icon, Menu, Button, Dropdown, notification, Tooltip, Badge } from "antd";
import classNames from "classnames";
import axios from "axios";

import { API_URL } from "../../../../utils/config";
import { presentTime, validateAddContrainst } from "../../../../utils/ytutil";

const Search = Input.Search;

class ListVideo extends React.Component {
  state = {
    statePlayingVideoId: null,
    filterkey: null,
    username: window.localStorage.getItem("app.username")
  };

  onAdd = async videoId => {
    const { playlistSettings, videos } = this.props;
    const { username } = this.state;

    const isValid = await validateAddContrainst(username, videoId, videos, playlistSettings);
    if (isValid) {
      axios
        .get(`${API_URL}/videos/add?videoId=${videoId}&userId=${username}&playlistId=${this.props.playplistId}`)
        .then(res => {
          if (res.data && res.data.id) {
            this.props.addVideo(res.data);

            notification.open({
              type: "success",
              message: "Video is added in the playlist!"
            });
          }
        });
    }
  };

  removeVideo(videoId) {
    axios.get(`${API_URL}/videos/remove?videoId=${videoId}&playlistId=${this.props.playplistId}`).then(res => {
      if (res.data) {
        this.props.removeVideo(videoId);

        notification.open({
          type: "success",
          message: "Video is removed from the playlist!"
        });
      }
    });
  }

  reportVideo(video) {
    const { username } = this.state;
    // this.props.getVideos();
    let currentReporter;
    if (video.reporters) {
      const reporter = Object.keys(video.reporters);
      // numberReporters = reporter.length
      currentReporter = reporter.filter(item => item === username);
    }
    if (currentReporter) {
      notification.open({
        type: "error",
        message: "You cannot report the song again"
      });
    } else {
      axios.get(`${API_URL}/videos/report?videoId=${video.id}&reporter=${this.state.username}`).then(
        notification.open({
          type: "success",
          message: "Video is report success in the playlist!"
        })
      );
    }
  }

  playVideo(videoId) {
    this.props.play(videoId);
  }

  filterVideo(e) {
    this.setState({ filterkey: e.key });
  }

  actions = () => (
    <Menu onClick={this.filterVideo.bind(this)}>
      <Menu.Item key="all">All</Menu.Item>
      <Menu.Item key="my-videos">My videos</Menu.Item>
    </Menu>
  );

  componentWillReceiveProps(nextProps) {
    const { playingVideoId } = nextProps;
    this.setState({ statePlayingVideoId: playingVideoId });
  }

  // componentWillMount() {
  //   console.log('dasd', this.props.playlistSettings)
  // }

  render() {
    let { playingVideoId, videos } = this.props;
    let { statePlayingVideoId, filterkey, username } = this.state;
    if (statePlayingVideoId === null) {
      statePlayingVideoId = playingVideoId;
    }
    if (filterkey === "my-videos") {
      videos = videos.filter(v => {
        return v.requester === username;
      });
    }

    return (
      <div className=" card">
        <div className="">
          <Dropdown overlay={this.actions()}>
            <a className="ant-dropdown-link" href="javascript: void(0);">
              Filter videos <Icon type="down" />
            </a>
          </Dropdown>
          <div className="video-page__add pull-right">
            <Search placeholder="Youtube video's id" enterButton="Add" onSearch={this.onAdd} />
          </div>
        </div>
        <ul className="video-page__watch-next">
          {videos.map((video, index) => {
            let numberReporters = 0;
            let currentReporter = [];
            if (video.reporters) {
              const reporter = Object.keys(video.reporters);
              numberReporters = reporter.length;
              currentReporter = reporter.filter(item => item === username);
            }

            return (
              <li className="video-page__next-item clearfix" key={index}>
                <a href="javascript: void(0);" className="video-page__next-item-link">
                  <div className="video-page__item-thumb">
                    <img
                      className="video-page__item-thumb-img"
                      src={video.cover.url}
                      alt={video.name}
                      onClick={() => this.playVideo(video.id)}
                    />
                  </div>

                  <div className="video-page__item-time">
                    <span
                      className={classNames(
                        "video-page__item-name",
                        playingVideoId === video.id ? "video-page__active" : ""
                      )}
                      onClick={() => this.playVideo(video.id)}
                    >
                      {presentTime(video.duration)}
                    </span>
                    {playingVideoId === video.id && (
                      <Icon
                        type="sound"
                        style={{
                          fontSize: "22px",
                          color: "#0088ff",
                          display: "block"
                        }}
                      />
                    )}
                    {playingVideoId !== video.id && video.requester === username && (
                      <Button icon="close" style={{ marginTop: "10px" }} onClick={() => this.removeVideo(video.id)} />
                    )}
                  </div>

                  <div className="video-page__item-descr">
                    <span
                      className={classNames(
                        "video-page__item-name",
                        playingVideoId === video.id ? "video-page__active" : ""
                      )}
                    >
                      {video.name}
                    </span>
                    <span className="video-page__item-author">{video.author}</span>
                    {/* <span className="video-page__item-author">Added by {video.requester}</span> */}
                    <Tooltip
                      placement="top"
                      title="Report this video will make it to be low prioritized shuffled in the playlist"
                    >
                      <Badge count={numberReporters} style={{ backgroundColor: "#FF5722" }}>
                        <Icon
                          className={classNames(currentReporter.length > 0 ? "user_currentReporter" : "")}
                          type="frown"
                          style={{ fontSize: "25px" }}
                          onClick={() => this.reportVideo(video)}
                        />
                      </Badge>
                    </Tooltip>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default ListVideo;
