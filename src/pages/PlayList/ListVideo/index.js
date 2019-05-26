import React from 'react'
import { List, Col, Row, Icon, Tooltip, Button, notification, Input } from 'antd'

import Item from './Item'
import Filter from './Filter'

import './style.scss'

class ListVideo extends React.Component {
  state = {
    playlistFilter: 0,
    playlistSearch: '',
  }

  handleFilter = isFilter => {
    this.setState({
      playlistFilter: isFilter,
    })
  }

  handleSearch = keyword => {
    this.setState({
      playlistSearch: keyword,
    })
  }

  render() {
    const { listSong, changeSong, shuffleSong, loopPlaylist, addSong, removeSong } = this.props
    const { playlistFilter, playlistSearch } = this.state

    let listSongFiltered = listSong
    if (playlistFilter) {
      listSongFiltered = listSong.filter(song => song.my)
    }
    if (playlistSearch) {
      listSongFiltered = listSongFiltered.filter(
        song =>
          song.name.toLocaleLowerCase().includes(playlistSearch.toLocaleLowerCase()) ||
          song.author.toLocaleLowerCase().includes(playlistSearch.toLocaleLowerCase()) ||
          song.id === playlistSearch,
      )
    }

    return (
      <Row>
        <Col className="list-filter">
          <Filter
            changeFilter={this.handleFilter}
            searchSong={this.handleSearch}
            addSong={addSong}
          />
        </Col>
        <Col className="list-tools">
          <Tooltip placement="topLeft" title={'Loop playlist'}>
            <Button type="link" shape="circle" icon="retweet" ghost onClick={loopPlaylist} />
          </Tooltip>
          <Tooltip placement="topLeft" title={'Shuffle playlist'}>
            <Button type="link" shape="circle" icon="swap" ghost onClick={shuffleSong} />
          </Tooltip>
        </Col>
        <Col className="list-songs">
          <List
            itemLayout="vertical"
            dataSource={listSongFiltered}
            renderItem={item => (
              <Item data={item} changeSong={changeSong} removeSong={removeSong} />
            )}
            className="list-video"
          />
        </Col>
      </Row>
    )
  }
}

export default ListVideo
