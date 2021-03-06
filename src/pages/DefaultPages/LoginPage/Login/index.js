import React from 'react'
import LoginForm from './LoginForm'
import './style.scss'

class Login extends React.Component {
  state = {}

  componentDidMount() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style.overflow = ''
  }

  render() {
    return (
      <div className="main-login main-login--fullscreen">
        <div className="main-login__header">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-login__header__logo">
                <a href="javascript: void(0);">
                  <img src="resources/images/music-logo.png" alt="Clean UI Admin Template" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="main-login__block main-login__block--extended pb-0">
          <div className="row">
            <div className="col-xl-12">
              <div className="main-login__block__promo text-black text-center">
                <h1 className="mb-3 text-black">
                  <strong>WELCOME TO GRANDE - COLLABORATIVE PLAYLIST</strong>
                </h1>
              </div>
              <div className="main-login__block__inner">
                <div className="main-login__block__form">
                  <LoginForm email={this.state.restoredEmail} />
                </div>
                <div className="main-login__block__sidebar">
                  <h4 className="main-login__block__sidebar__title text-white">
                    <strong>Share & Enjoy Music</strong>
                    <br />
                    <span>Together</span>
                  </h4>
                  <div className="main-login__block__sidebar__item">
                    "Without music, life would be a mistake" ― Friedrich Nietzsche
                  </div>
                  <div className="main-login__block__sidebar__item">
                    "Without music, life would be a blank to me" - Jane Austen
                  </div>
                  <div className="main-login__block__sidebar__item">
                    "Music gives a soul to the universe, wings to the mind, flight to the
                    imagination and life to everything." - Plato
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-login__footer text-center">
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <a href="javascript: void(0);">Terms of Use</a>
            </li>
            <li className="active list-inline-item">
              <a href="javascript: void(0);">Compliance</a>
            </li>
            <li className="list-inline-item">
              <a href="javascript: void(0);">Confidential Information</a>
            </li>
            <li className="list-inline-item">
              <a href="javascript: void(0);">Support</a>
            </li>
            <li className="list-inline-item">
              <a href="javascript: void(0);">Contacts</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Login
