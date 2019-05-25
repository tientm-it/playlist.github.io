import React from 'react'
import { Dropdown, Icon, Menu, Input } from 'antd'
import { API_URL } from '../../../../utils/config'
import axios from 'axios'

const actions = (
  <Menu>
    <Menu.Item>
      <Icon type="edit" /> Edit Post
    </Menu.Item>
    <Menu.Item>
      <Icon type="delete" /> Delete Post
    </Menu.Item>
    <Menu.Item>
      <Icon type="frown-o" /> Mark as a Spam
    </Menu.Item>
  </Menu>
)

class PlaylistView extends React.Component {
  state = {
    playplistInfo: {},
  }

  getPlayplist() {
    axios.get(`${API_URL}/playlists/view?playlistId=${this.props.playplistId}`).then(result => {
      this.setState({ playplistInfo: result.data })
    })
  }

  componentWillMount() {
    this.getPlayplist()
  }

  render() {
    let { playplistInfo } = this.state

    return (
      <div className="video-page__main-content">
        <div className="video-page__player">
          <img src={playplistInfo.photo} alt="" />
        </div>
        <div className="video-page__descr">
          <div className="video-page__descr-wrapper card">
            <div className="video-page__published mb-2">
              <strong>{playplistInfo.title}</strong>
              <div className="pull-right">
                <Dropdown overlay={actions}>
                  <a className="ant-dropdown-link" href="javascript: void(0);">
                    Actions <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
            </div>
            <p className="video-page__descr-text mb-0">{playplistInfo.description}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default PlaylistView
