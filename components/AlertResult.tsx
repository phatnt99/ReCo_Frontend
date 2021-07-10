import React, { useState } from "react";
import { Alert } from "reactstrap";

const AlertResult = (props) => {
  const { resultType, message, handle } = props;

  const [visible, setVisible] = useState(true);
  const onDismiss = () => {
    handle({
      type: null,
      message: ''
    })
    setVisible(false)
  };

  return (<Alert
    style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      margin: '3rem'
    }}
    color={resultType} isOpen={visible} toggle={onDismiss}>
    {message}
  </Alert>)
}

export default AlertResult;