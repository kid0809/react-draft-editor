import React from 'react'
import ControlButton from './ControlButton'
import ColorButton from './ColorButton'
import LinkButton from './LinkButton'
import PicButton from './picButton'
import blod from '../public/images/blod.png'

const INLINE_STYLES = [
  {background: blod, style: 'BOLD'},
  {background: blod, style: 'ITALIC'},
  {background: blod, style: 'UNDERLINE'},
  {background: blod, style: 'lineThrough'},
]
console.log(blod)
const InlineControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()

  const buttons = INLINE_STYLES.map((type, i) => (
    <ControlButton
      key={type.classname}
      background={type.background}
      active={currentStyle.has(type.style)}
      style={type.style}
      onToggle={props.onToggle}
    />
  ))
  return (
    <div className="editor-controls">
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
      <PicButton />
    </div>
  )
}

export default InlineControls