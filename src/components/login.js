import React from 'react';

// Grommet
import {
  Button, Heading, Text, Box,
} from 'grommet';

const mixifyServerURI = 'https://mixify-server.herokuapp.com/authClient';
const mixifyDevServerURI = 'http://localhost:9090/authClient';

const Login = () => {
  return (
    <Box alignSelf="center" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large" width="500px" height="300px" id="login">
      <Heading color="brand">Mixify</Heading>
      <Text textAlign="center">
            Welcome to Mixify! Create hit playlists that mix your {'friend\'s'} music tastes together.
      </Text>
      <a href={mixifyDevServerURI} rel="noopener noreferrer">
        <Button primary color="brand" hoverIndicator="true" label="Go" />
      </a>
    </Box>
  );
};

export default Login;
