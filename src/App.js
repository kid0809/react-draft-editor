import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Editor from './components/XEditor'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app-mount')
  )
}

render(Editor)

if(module.hot) {
  module.hot.accept()
}
