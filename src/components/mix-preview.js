import React from 'react';

const MixPreview = (props) => {
  return (
    <button type="button" onClick={() => props.goTo(props.mix.id)}>See mix {props.mix.id}</button>
  );
};

export default MixPreview;
