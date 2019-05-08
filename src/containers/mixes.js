import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Grommet
import {
  Button, Heading, Text, TextInput, Box, Grid,
} from 'grommet';

import Login from '../components/login';

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
      collaboratorTokens: [this.props.mixOwner.token],
      tracks: [],
    };
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
    if (false) {
      return (<Login />);
    } else {
      return (
        <Box id="mixes" pad="medium">
          <Grid
            fill
            rows={['600px']}
            columns={['400px', '800px']}
            gap="small"
            areas={[
              { name: 'input', start: [0, 0], end: [0, 0] },
              { name: 'mixList', start: [1, 0], end: [1, 0] },
            ]}
          >
            <Box gridArea="input" border={{ size: 'medium', color: 'brand' }} pad="large" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              <Heading color="brand">Make a mix.</Heading>
              <TextInput placeholder="name" value={this.state.newMixName} onChange={event => this.setState({ newMixName: event.target.value })} />
              <Button primary color="brand" hoverIndicator="true" label="Create" onClick={this.makeNewMix} />
            </Box>
            <Box gridarea="mixList" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large">
              {mixes}
            </Box>
          </Grid>
        </Box>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    mixOwner: state.auth,
    mixes: state.mixes,
  }
);

export default withRouter(connect(mapStateToProps, { fetchMixes, currentizeMix, createMix })(Mixes));
