import React from 'react'
import {Editor, EditorState, RichUtils, convertToRaw} from 'draft-js'
import '../public/css/Draft.css'
import '../public/css/RichEditor.css'


// 不用react生命周期函数可以使用这种简便写法

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState})
  }


  render() {
    const {editorState} = this.state
    console.log(editorState)

    // console.log(convertToRaw(editorState.getCurrentContent()))

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    var contentState = editorState.getCurrentContent()
    console.log(convertToRaw(contentState))

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <div className={className} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            placeholder="Tell a story..."
            ref="editor"
          />
        </div>
      </div>
    )
  }
}


export default Test
