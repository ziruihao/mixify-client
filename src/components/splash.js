import React from 'react';

// Grommet
import {
  Button, Heading, Text, Box,
} from 'grommet';

// const mixifyServerURI = 'https://mixify-server.herokuapp.com/authOwner';
const mixifyServerURI = 'http://localhost:9090/authOwner';

const Splash = () => {
  return (
    <Box alignSelf="center" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large" width="500px" height="300px" id="login">
      <Heading color="brand">Mixify</Heading>
      <Text textAlign="center" margin={{ horizontal: 'small' }}>
        Create hit playlists that mix your {'friend\'s'} music tastes together.
      </Text>
      <a href={mixifyServerURI} rel="noopener noreferrer">
        <Button primary color="brand" hoverIndicator="true" label="Create Mix" />
      </a>
    </Box>
  );
};

export default Splash;
