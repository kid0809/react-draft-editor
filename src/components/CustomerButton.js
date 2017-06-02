import React from 'react'

class CustomerButton extends React.Component {
  constructor() {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let className = 'customer-styleButton'
    if (this.props.active) {
      className += ' customer-activeButton'
    }

    return (
      <span className={className} onClick={this.onToggle}>
        <i className={`fa ${this.props.classname}`} />
      </span>
    )
  }
}

export default CustomerButton
