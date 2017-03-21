import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Editor from './components/Editor'
import Test from './components/Test'
import myEditor from './components/myEditor'
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
