import React from 'react'
import axios from 'axios'
import { Input, Select, notification } from 'antd'

import { API_URL } from 'utils/config'
import { presentTime, validateAddContrainst } from 'utils/ytutil'
import './style.scss'

class Filter extends React.Component {
  state = {
    statePlayingVideoId: null,
    filterkey: null,
    username: window.localStorage.getItem('app.username'),
    playlistId: 'PLbBWXuqbWaF2m8U9Pt63fO08ltWijDZtl',
  }

  onAdd = async videoId => {
    const { playlistSettings, videos = [] } = this.props
    const { username } = this.state
    const setting = {
      maxSongsPerUser: 3,
      maxVideoLen: 300,
    }

    const isValid = await validateAddContrainst(
      username,
      videoId,
      videos,
      playlistSettings || setting,
    )
    if (isValid) {
      axios
        .get(
          `${API_URL}/videos/add?videoId=${videoId}&userId=${username}&playlistId=${
            this.state.playlistId
          }`,
        )
        .then(res => {
          if (res.data && res.data.id) {
            this.props.addSong(res.data)

            notification.open({
              type: 'success',
              message: 'Video is added in the playlist!',
            })
          }
        })
    }
  }

  render() {
    const { changeFilter, searchSong } = this.props

    return (
      <Input.Group compact>
        <Select
          defaultValue="All videos"
          style={{ width: '40%', verticalAlign: 'middle !important' }}
          onChange={changeFilter}
        >
          <Select.Option value={0}>All videos</Select.Option>
          <Select.Option value={1}>My videos</Select.Option>
        </Select>
        <Input.Search
          className="group-right"
          style={{ width: '60%', verticalAlign: 'middle !important' }}
          // onChange={(e) => searchSong(e.target.value)}
          // onSearch={searchSong}
          placeholder="Video id"
          enterButton="Add"
          onSearch={this.onAdd}
        />
      </Input.Group>
    )
  }
}

export default Filter
