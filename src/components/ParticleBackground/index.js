import React from 'react'
import Particles from 'react-particles-js'

import './style.scss'

export default () => (
  <div className="particle-bg-wrapper">
    <Particles
      params={{
        particles: {
          number: {
            value: 200,
          },
          size: {
            value: 3,
          },
          color: {
            value: '#FA8072',
          },
          line_linked: {
            color: '#FA8072',
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: 'grab',
            },
          },
        },
      }}
    />
  </div>
)
