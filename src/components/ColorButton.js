import React from 'react'


const colors = [
  {color: 'rgba(255, 0, 0, 1.0)', style: 'red'},
  {color: 'rgba(255, 127, 0, 1.0)', style: 'orange'},
  {color: 'rgba(180, 180, 0, 1.0)', style: 'yellow'},
  {color: 'rgba(0, 180, 0, 1.0)', style: 'green'},
  {color: 'rgba(0, 0, 255, 1.0)', style: 'blue'},
  {color: 'rgba(75, 0, 130, 1.0)', style: 'indigo'},
  {color: 'rgba(127, 0, 255, 1.0)', style: 'violet'},
]

class ColorButton extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    }
    // this.onColorToggle = (e) => {
    //   e.preventDefault();
    //   this.props.onColorToggle(this.props.style);
    // }
    this.close = () => this.setState({ show: false })
  }


  _showToggle(e) {
    this.setState({ show: !this.state.show })
  }

  onColorToggle(style, event) {
    event.preventDefault()
    this.props.onColorToggle(style)
  }


  renderColorWarp() {
    const { show } = this.state
    const colorList = colors.map((data, i) => {
      return (
        <li key={i}><i className="color-icon" style={{ background: data.color }} onMouseDown={this.onColorToggle.bind(this, data.style)} /></li>
      )
    })

    if (show) {
      return (
        <div>
          <div className="color-warpper">
            <div className="color-warpper-header">标准颜色</div>
            <div className="color-warpper-content">
              <ul>
                {colorList}
              </ul>
            </div>
          </div>
          <div className="color-mask" onClick={this.close}></div>
        </div>
      )
    }

    return null
  }

  render() {
    const { inlineStyle } = this.props
    const currentStyle = colors.filter((data) => {
      return inlineStyle.has(data.style)
    })[0]

    const style = currentStyle ? { background: currentStyle.color } : null

    return (
      <span className="color-button" style={{ position: 'relative' }}>
        <i className="color-icon" onMouseDown={this._showToggle.bind(this)} style={style}/>
        {this.renderColorWarp()}
      </span>
    );
  }
}

export default ColorButton
