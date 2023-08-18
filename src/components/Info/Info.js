import React from 'react';
import { Grid, Column } from '@carbon/react';

const generateUrl = url => {
  return `${process.env.PUBLIC_URL}/${url}.png`;
};

export { generateUrl };
