import React from 'react';
import GitHubButton from 'react-github-btn';

import { OUTLINE, isHome, transformRouteString, createRoute } from './Outline';
import {
  Theme,
  Header,
  HeaderName,
  HeaderContainer,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  Link,
} from '@carbon/react';

const PageHeader = props => (
  <Theme theme="g90">
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

class PageHeaderExtended extends React.Component {
  constructor(props) {
    super();
    this.state = { current_tab: props.currentTab, [props.currentTab]: true };
  }

  onClickTab = tabName => {
    this.props.onClickTab(tabName);
  };

  componentDidUpdate(prevProps) {
    if (this.props.currentTab !== prevProps.currentTab) {
      this.setState({
        ...this.state,
        current_tab: this.props.currentTab,
        [this.state.current_tab]: false,
        [this.props.currentTab]: true,
      });
    }
  }

  render() {
    return (
      <Theme theme="white">
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Header aria-label="Header">
                <SkipToContent />
                <HeaderName prefix="Victims of Weak Teams">
                  Leaderboard
                </HeaderName>

                <SideNav
                  className={isHome(this.state.current) ? '' : 'activate-red'}
                  expanded={isSideNavExpanded}
                  isPersistent={true}
                  aria-label="Side navigation">
                  <SideNavItems>
                    {OUTLINE.map(item => (
                      <>
                        {!item.children && (
                          <SideNavLink
                            key={item.name}
                            as={Link}
                            to={'/' + transformRouteString(item.name)}
                            children={item.name}
                            onClick={this.onClickTab.bind(this, item.name)}
                            isActive={this.state[item.name]}
                          />
                        )}
                        {item.children && (
                          <SideNavMenu
                            key={item.name}
                            title={item.name}
                            defaultExpanded>
                            {item.children.map(child => (
                              <SideNavMenuItem
                                key={child}
                                onClick={this.onClickTab.bind(
                                  this,
                                  createRoute(item, child)
                                )}
                                isActive={this.state[createRoute(item, child)]}>
                                {child}
                              </SideNavMenuItem>
                            ))}
                          </SideNavMenu>
                        )}
                      </>
                    ))}
                  </SideNavItems>
                  <div className="footer">
                    <GitHubButton
                      href="https://github.com/TathagataChakraborti/victims-of-weak-teams"
                      data-size="large"
                      data-show-count="true"
                      aria-label="Stars on GitHub">
                      Star
                    </GitHubButton>
                  </div>
                </SideNav>
              </Header>
            </>
          )}
        />
      </Theme>
    );
  }
}

export { PageHeader, PageHeaderExtended };
