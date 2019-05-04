import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
  render() {
    return (
      <div />
    );
  }
}

const mapStateToProps = state => (
  {
    music: state.music,
  }
);

export default withRouter(connect(mapStateToProps, null)(Login));
