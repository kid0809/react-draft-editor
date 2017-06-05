import React from 'react'


class LinkButton extends React.Component {
  constructor() {
    super();
  }


  renderLinkWarp() {
    const { showURLInput, onURLChange, urlValue, onLinkInputKeyDown, closeUrlInput } = this.props
    if (showURLInput) {
      return (
        <div>
          <div className="url-warpper">
            <div className="url-warpper-header">请输入超链接地址:</div>
            <div className="url-warpper-content">
              <input
                onChange={onURLChange}
                ref="url"
                type="text"
                value={urlValue}
                onKeyDown={onLinkInputKeyDown}
                placeholder="http://"
              />
            </div>
          </div>
          <div className="mask" onClick={closeUrlInput}></div>
        </div>
      )
    }

    return null
  }

  render() {
    console.log(this.props.showURLInput)
    return (
      <span className="customer-styleButton">
        <i className="fa fa-link" onClick={this.props.promptForLink} />
        {this.renderLinkWarp()}
      </span>
    )
  }
}

export default LinkButton
