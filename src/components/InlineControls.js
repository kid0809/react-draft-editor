import React from 'react'
import ControlButton from './ControlButton'
import ColorButton from './ColorButton'

const INLINE_STYLES = [
  {classname: 'fa-bold', style: 'BOLD'},
  {classname: 'fa-italic', style: 'ITALIC'},
  {classname: 'fa-underline', style: 'UNDERLINE'},
  {classname: 'fa-eraser', style: 'CODE'},
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
    </div>
  )
}

export default InlineControls