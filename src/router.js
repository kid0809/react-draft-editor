import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

// import Editor from './components/Editor'
// import myEditor from './components/myEditor'
import XEditor from './components/XEditor'

const BasicRouter = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">X-editor</Link></li>
{/*        <li><Link to="/draft">draft-editor</Link></li>
        <li><Link to="/targeteditor">target-editor</Link></li> */}
      </ul>
      <Route exact path="/" component={XEditor} />
{/*      <Route path="/draft" component={Editor} />
      <Route path="/targeteditor" component={myEditor} /> */}
    </div>
  </Router>
)

export default BasicRouter
