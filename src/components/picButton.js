import React from 'react'


class PictureButton extends React.Component {
  constructor() {
    super()
  }


  renderPicWarp() {
    const { showImgInput, onURLChange, urlValue, onImageKeyDown, closeUrlInput } = this.props
    if (showImgInput) {
      return (
        <div>
          <div className="link-warpper">
            <input
              onChange={onURLChange}
              ref="url"
              type="text"
              value={urlValue}
              onKeyDown={onImageKeyDown}
            />
          </div>
          <div className="mask" onClick={closeUrlInput}></div>
        </div>
      )
    }

    return null
  }

  render() {
    return (
      <span className="customer-styleButton">
        <i className="fa fa-picture-o"  onClick={this.props.promptForImage}/>
        {this.renderPicWarp()}
      </span>
    )
  }
}

export default PictureButton
