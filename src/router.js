import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Editor from './components/Editor'
import Test from './components/Test'
import myEditor from './components/myEditor'

const BasicRouter = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/test">About</Link></li>
        <li><Link to="/myeditor">Topics</Link></li>
      </ul>
      <Route exact path="/" component={Editor} />
      <Route path="/test" component={Test} />
      <Route path="/myeditor" component={myEditor} />
    </div>
  </Router>
)

export default BasicRouter
