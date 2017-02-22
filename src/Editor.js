import React from 'react'
import Test from './Test'
import styles from './Editor.css'

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      triggle: false
    }
  }

  focusHandle() {
    this.setState({
      triggle: true
    })
  }

  blurHandle() {
    this.setState({
      triggle: false
    })
  }

  render() {
    console.log(styles)
    return (
      <div>
        <div className={styles.app}>
          i am kid hahaha!!!
          <a href="#" onFocus={this.focusHandle.bind(this)} onBlur={this.blurHandle.bind(this)} style={{ color: 'black', textDecoration: 'none' }}>123</a>
        </div>
        <Test />
      </div>
    )
  }
}

export default Editor
