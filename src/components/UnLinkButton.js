import React from 'react'


const UnLinkButton = (props) => (
  <span className="customer-styleButton">
    <i className="fa fa-unlink" onClick={props.removeLink} />
  </span>
)

export default UnLinkButton
