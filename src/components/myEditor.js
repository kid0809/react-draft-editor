import React from 'react'
// import marked from 'marked'
import cNames from 'classnames'

import '../public/css/customEditor.css'


class MdEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      panelClass: 'md-panel',
      mode: 'split',
      isFullScreen: false,
      result: this.props.content || ''
    }
  }


  componentDidMount() {
    // cache dom node
    this.textControl = this.editor
    this.previewControl = this.preview
  }

  componentWillUnmount() {
    this.textControl = null
    this.previewControl = null
  }

  // event handlers
  onChange(event) {
    const { contentChange } = this.props
    const content = event.target.value
    contentChange(content)
    // this.setState({ result: marked(this.textControl.value) }) // change state
  }


  // widgets constructors
  getModeBar() {
    const checkActive = mode => cNames({ active: this.state.mode === mode })

    return (
      <ul className="md-modebar">
        <li className="tb-btn pull-right">
          <a className={checkActive('preview')} onClick={this.changeMode.bind(this, 'preview')} title="预览模式">
            <i className="fa fa-eye" />
          </a>
        </li> {/* preview mode */}
        <li className="tb-btn pull-right">
          <a className={checkActive('split')} onClick={this.changeMode.bind(this, 'split')} title="分屏模式">
            <i className="fa fa-columns" />
          </a>
        </li> {/* split mode */}
        <li className="tb-btn pull-right">
          <a className={checkActive('edit')} onClick={this.changeMode.bind(this, 'edit')} title="编辑模式">
            <i className="fa fa-pencil" />
          </a>
        </li> {/* edit mode */}
        <li className="tb-btn spliter pull-right" />
        <li className="tb-btn pull-right">
          <a title="全屏模式" onClick={this.toggleFullScreen.bind(this)}>
            <i className="fa fa-arrows-alt" />
          </a>
        </li> {/* full-screen */}
      </ul>
    )
  }

  getToolBar() {
    return (
      <ul className="md-toolbar clearfix">
        <li className="tb-btn"><a title="加粗" onClick={this.boldText.bind(this)}><i className="fa fa-bold" /></a></li> {/* bold */}
        <li className="tb-btn"><a title="斜体" onClick={this.italicText.bind(this)}><i className="fa fa-italic" /></a></li> {/* italic */}
        <li className="tb-btn spliter" />
        <li className="tb-btn"><a title="链接" onClick={this.linkText.bind(this)}><i className="fa fa-link" /></a></li> {/* link */}
        <li className="tb-btn"><a title="引用" onClick={this.blockquoteText.bind(this)}><i className="fa fa-outdent" /></a></li> {/* blockquote */}
        <li className="tb-btn"><a title="代码段" onClick={this.codeText.bind(this)}><i className="fa fa-code" /></a></li> {/* code */}
        <li className="tb-btn"><a title="图片" onClick={this.pictureText.bind(this)}><i className="fa fa-picture-o" /></a></li> {/* picture-o */}
        <li className="tb-btn spliter" />
        <li className="tb-btn"><a title="有序列表" onClick={this.listOlText.bind(this)}><i className="fa fa-list-ol" /></a></li> {/* list-ol */}
        <li className="tb-btn"><a title="无序列表" onClick={this.listUlText.bind(this)}><i className="fa fa-list-ul" /></a></li> {/* list-ul */}
        <li className="tb-btn"><a title="标题" onClick={this.headerText.bind(this)}><i className="fa fa-header" /></a></li> {/* header */}
      </ul>
    )
  }

  changeMode(mode) {
    this.setState({ mode })
  }

  toggleFullScreen() {
    this.setState({ isFullScreen: !this.state.isFullScreen })
  }

  // default text processors
  preInputText(text, preStart, preEnd) {
    const { contentChange } = this.props

    const start = this.textControl.selectionStart
    const end = this.textControl.selectionEnd
    const origin = this.textControl.value

    if (start !== end) {
      const exist = origin.slice(start, end)
      text = text.slice(0, preStart) + exist + text.slice(preEnd)
      preEnd = preStart + exist.length
    }
    this.textControl.value = origin.slice(0, start) + text + origin.slice(end)
    // pre-select
    this.textControl.setSelectionRange(start + preStart, start + preEnd)

    contentChange(this.textControl.value)
    // this.setState({ result: this.textControl.value }) // change state
  }

  boldText() {
    this.preInputText('**加粗文字**', 2, 6)
  }

  italicText() {
    this.preInputText('_斜体文字_', 1, 5)
  }

  linkText() {
    this.preInputText('[链接文本](http://www.yourlink.com)', 1, 5)
  }

  blockquoteText() {
    this.preInputText('> 引用', 2, 4)
  }

  codeText() {
    this.preInputText('```\ncode block\n```', 4, 14)
  }

  pictureText() {
    this.preInputText('![alt](www.yourlink.com)', 2, 5)
  }

  listUlText() {
    this.preInputText('- 无序列表项0\n- 无序列表项1', 2, 8)
  }

  listOlText() {
    this.preInputText('1. 有序列表项0\n2. 有序列表项1', 3, 9)
  }

  headerText() {
    this.preInputText('## 标题', 3, 5)
  }

  render() {
    console.log('render')
    const panelClass = cNames(['md-panel', { fullscreen: this.state.isFullScreen }])
    const editorClass = cNames(['md-editor', { expand: this.state.mode === 'edit' }])
    const previewClass = cNames(['md-preview', 'markdown', { expand: this.state.mode === 'preview', shrink: this.state.mode === 'edit' }])

    return (
      <div className={panelClass}>
        <div className="md-menubar">
          {this.getModeBar()}
          {this.getToolBar()}
        </div>
        <div className={editorClass}>
          <textarea ref={(c) => { this.editor = c }} name="content" value={this.props.content} onChange={this.onChange.bind(this)} />{/* style={{height: this.state.editorHeight + 'px'}} */}
        </div>
        <div className={previewClass} ref={(c) => { this.preview = c }} dangerouslySetInnerHTML={{ __html: this.props.content }} />
        <div className="md-spliter" />
      </div>
    )
  }
}

export default MdEditor
