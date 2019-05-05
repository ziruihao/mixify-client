import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// actions
import { fetchMixes, currentizeMix, createMix } from '../actions';

import MixPreview from '../components/mix-preview';

class Mixes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMixName: '',
    };
  }

  componentDidMount() {
    this.props.fetchMixes();
  }

  makeNewMix = () => {
    const newMix = {
      name: this.state.newMixName,
      users: [],
      tracks: [],
    };
    console.log(newMix);
    this.props.createMix(newMix);
  }

  /**
   * Goes to a certain mix.
   */
  goTo = (id) => {
    this.props.currentizeMix(id, this.props.history);
  }

  render() {
    const mixes = this.props.mixes.all.map(mix => <MixPreview goTo={this.goTo} key={mix.id} mix={mix} />);
    return (
      <div id="mixesList">
        <input placeholder="name" value={this.state.newMixName} onChange={event => this.setState({ newMixName: event.target.value })} />
        <button type="button" onClick={this.makeNewMix}>Create Mix</button>
        {mixes}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    owner: state.auth,
    mixes: state.mixes,
  }
);

export default withRouter(connect(mapStateToProps, { fetchMixes, currentizeMix, createMix })(Mixes));
