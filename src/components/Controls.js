import React from 'react'
import CustomerButton from './CustomerButton'
import ColorButton from './ColorButton'
import LinkButton from './LinkButton'
import UnLinkButton from './unLinkButton'
import PictureButton from './picButton'

const BLOCK_TYPES = [
  {classname: 'fa-header', style: 'header-one'},
  {classname: 'fa-list', style: 'unordered-list-item'},
  {classname: 'fa-list-ol', style: 'ordered-list-item'},
  {classname: 'fa-quote-right', style: 'blockquote'},
  {classname: 'fa-code', style: 'code-block'},
]


const INLINE_STYLES = [
  {classname: 'fa-bold', style: 'BOLD'},
  {classname: 'fa-italic', style: 'ITALIC'},
  {classname: 'fa-underline', style: 'UNDERLINE'},
  {classname: 'fa-strikethrough', style: 'lineThrough'},
]

const Controls = (props) => {
  const {editorState} = props
  const currentStyle = editorState.getCurrentInlineStyle()
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  const blockButtons = BLOCK_TYPES.map((type) =>
    <CustomerButton
      key={type.classname}
      active={type.style === blockType}
      classname={type.classname}
      onToggle={props.onBlockToggle}
      style={type.style}
    />
  )


  const inlineButtons = INLINE_STYLES.map((type, i) => (
    <CustomerButton
      key={type.classname}
      classname={type.classname}
      active={currentStyle.has(type.style)}
      style={type.style}
      onToggle={props.onInlineToggle}
    />
  ))


  return (
    <div className="editor-controls">
      {blockButtons}
      {inlineButtons}
      <ColorButton inlineStyle={currentStyle} onColorToggle={props.onColorToggle} />
      <LinkButton
        onURLChange={props.onURLChange}
        promptForLink={props.promptForLink}
        confirmLink={props.confirmLink}
        onLinkInputKeyDown={props.onLinkInputKeyDown}
        closeUrlInput={props.closeUrlInput}
        showURLInput={props.showURLInput}
        urlValue={props.urlValue} />
      <UnLinkButton removeLink={props.removeLink} />
      <PictureButton 
        onURLChange={props.onURLChange}
        promptForImage={props.promptForImage}
        confirmImage={props.confirmImage}
        onImageKeyDown={props.onImageKeyDown}
        closeUrlInput={props.closeUrlInput}
        showImgInput={props.showImgInput}
        urlValue={props.urlValue} />
    </div>
  )
}

export default Controls
