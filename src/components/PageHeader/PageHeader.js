import React from 'react';
import {
  Theme,
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
      <Theme theme="g100">
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Header aria-label="Header">
                <SkipToContent />
                <HeaderName prefix="Victims of Weak Teams">
                  Auction Portal
                </HeaderName>
              </Header>
            </>
          )}
        />
      </Theme>
    );
  }
}

export default PageHeader;
