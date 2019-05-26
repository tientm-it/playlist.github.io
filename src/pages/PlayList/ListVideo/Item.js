import React from 'react'
import { List, Avatar, Icon } from 'antd'
import { presentTime } from 'utils/ytutil'

const IconText = ({ type, text, onClick }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8, verticalAlign: 'middle' }} onClick={onClick} />
    <span style={{ verticalAlign: 'middle' }}>{text}</span>
  </span>
)

class Item extends React.Component {
  renderItemAction = removeSong => {
    const { id, my, countPlay, liked, playing } = this.props.data

    const another =
      my && !playing ? [<IconText type="delete" onClick={() => removeSong(id)} />] : []
    return [...[<IconText type="like" text={liked} />], ...another]
  }

  render() {
    const { data, changeSong, removeSong } = this.props

    return (
      <List.Item
        key={data.id}
        actions={this.renderItemAction(removeSong)}
        extra={
          data.playing ? (
            <img
              width={80}
              src={`${process.env.PUBLIC_URL}/resources/images/equalizer-bars.gif`}
              alt="Playing..."
            />
          ) : null
        }
      >
        <List.Item.Meta
          avatar={
            <div>
              <Avatar
                style={{
                  width: data.thumbnails.medium.width,
                  height: data.thumbnails.medium.height,
                }}
                size="large"
                shape="square"
                src={data.thumbnails.medium.url}
              />
            </div>
          }
          title={<div className="list-video-title-name">{data.name}</div>}
          description={
            <div className="list-video-title description">
              <div className="list-video-title-author">{data.author}</div>
              <div className="list-video-title-view">{`${data.countPlay} Views`}</div>
            </div>
          }
          onClick={() => changeSong(data)}
          style={{ cursor: 'pointer' }}
        />
        <div className="video-duration">{presentTime(data.duration)}</div>
      </List.Item>
    )
  }
}

export default Item
