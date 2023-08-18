import React from 'react';
import { Theme, Grid, Column } from '@carbon/react';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Theme theme="white">
        <Grid>
          <Column lg={16} md={8} sm={4}></Column>
        </Grid>
      </Theme>
    );
  }
}

export default LandingPage;
