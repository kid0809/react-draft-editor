import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import BaseRouter from './router'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app-mount')
  )
}

render(BaseRouter)

if(module.hot) {
  module.hot.accept()
}
