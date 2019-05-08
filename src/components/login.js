import React from 'react';

// Grommet
import {
  Button, Heading, Text, Box,
} from 'grommet';


const Login = () => {
  return (
    <Box alignSelf="center" border={{ size: 'medium', color: 'brand' }} pad="medium" animation="fadeIn" justify="around" align="center" alignContent="between" elevation="xlarge" round="large" width="500px" height="300px" id="login">
      <Heading color="brand">Mixify</Heading>
      <Text>
            Welcome to Mixify! Create hit playlists that mix your friends music tastes together.
      </Text>
      <a href="https://mixify-server.herokuapp.com/login" rel="noopener noreferrer">
        <Button primary color="brand" hoverIndicator="true" label="Go" />
      </a>
    </Box>
  );
};

export default Login;
