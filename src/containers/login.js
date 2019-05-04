import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Grommet
import { Button } from 'grommet';

// actions
import { requestLogin } from '../actions';

class Login extends React.Component {
  requestLogin = () => {
    this.props.requestLogin();
  }

  render() {
    return (
      <div>
        <Button label="Login with Spotify" onClick={this.requestLogin} />
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    music: state.music,
  }
);

export default withRouter(connect(mapStateToProps, { requestLogin })(Login));
