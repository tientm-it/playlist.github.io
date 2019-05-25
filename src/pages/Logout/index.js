import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'ducks/app'

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout())
  },
})

const mapStateToProps = (state, props) => ({
  userState: state.app.userState,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class LogoutPage extends React.Component {
  componentDidMount() {
    this.props.logout()
  }

  render() {
    return null
  }
}

export default LogoutPage
