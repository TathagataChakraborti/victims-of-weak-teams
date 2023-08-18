import React from 'react';
import {
  Header,
  HeaderName,
  HeaderContainer,
  SkipToContent,
} from '@carbon/react';

class PageHeader extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="Header">
              <SkipToContent />
              <HeaderName prefix="EPL">Victims of Weak Teams</HeaderName>
            </Header>
          </>
        )}
      />
    );
  }
}

export default PageHeader;
