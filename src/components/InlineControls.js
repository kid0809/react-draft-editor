import React from 'react'
import ControlButton from './ControlButton'
import ColorButton from './ColorButton'
import LinkButton from './LinkButton'

const INLINE_STYLES = [
  {classname: 'fa-bold', style: 'BOLD'},
  {classname: 'fa-italic', style: 'ITALIC'},
  {classname: 'fa-underline', style: 'UNDERLINE'},
  {classname: 'fa-strikethrough', style: 'lineThrough'},
]

const InlineControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()

  const buttons = INLINE_STYLES.map((type, i) => (
    <ControlButton
      key={type.classname}
      classname={type.classname}
      active={currentStyle.has(type.style)}
      style={type.style}
      onToggle={props.onToggle}
    />
  ))
  return (
    <div className="RichEditor-controls">
      {buttons}
      <ColorButton inlineStyle={currentStyle} onColorToggle={props.onColorToggle} />
      <LinkButton  
        onURLChange={props.onURLChange}
        promptForLink={props.promptForLink}
        confirmLink={props.confirmLink}
        onLinkInputKeyDown={props.onLinkInputKeyDown}
        removeLink={props.removeLink}
        closeUrlInput={props.closeUrlInput}
        showURLInput={props.showURLInput}
        urlValue={props.urlValue} />
    </div>
  )
}

export default InlineControls