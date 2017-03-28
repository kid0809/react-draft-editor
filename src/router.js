import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Editor from './components/Editor'
import myEditor from './components/myEditor'

const BasicRouter = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">draft-editor</Link></li>
        <li><Link to="/targeteditor">target-editor</Link></li>
      </ul>
      <Route exact path="/" component={Editor} />
      <Route path="/targeteditor" component={myEditor} />
    </div>
  </Router>
)

export default BasicRouter
