import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Counter = (props) => {
  return (
    <div>
      Current Count: {props.count}
    </div>
  );
};

const mapStateToProps = state => (
  {
    count: state.count,
  }
);

export default withRouter(connect(mapStateToProps, null)(Counter));
