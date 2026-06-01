import React from 'react';
import GitHubButton from 'react-github-btn';

import {
  BuyMeACoffeeWidget,
  BuyMeACoffeeButton,
} from '../../components/BasicElements';

import {
  LicenseThirdPartyDraft,
  Trophy,
  ChartCombo,
  CurrencyPound,
  ArrowRight,
} from '@carbon/icons-react';

import { Title, P } from '@carbon-labs/mdx-components';

import {
  Grid,
  Column,
  ContainedList,
  ContainedListItem,
  Tag,
  ClickableTile,
  Tile,
} from '@carbon/react';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid>
        <Column lg={8} md={8} sm={4}>
          <Title>Victims of Weak Teams</Title>
          <P>
            VOWT is a free-to-play auction add-on to the Fantasy Premier League
            Draft. Instead of a randomized snake-style draft you get to host a
            real draft using the VOWT interface. During the season you also get
            free access to auction-specific statistics for your league!
          </P>

          <br />
          <br />
          <Tag className="numbers-tag square-tags" size="md">
            Number of visitors
          </Tag>
          <Tag className="square-tags" size="md" type="green">
            0
          </Tag>

          <br />
          <br />

          <Tag className="numbers-tag square-tags" size="md">
            Auctions to date
          </Tag>
          <Tag className="square-tags" size="md" type="green">
            6
          </Tag>

          <br />
          <br />
          <br />

          <ContainedList size="sm">
            <ContainedListItem
              renderIcon={LicenseThirdPartyDraft}
              className="game-highlights">
              Use your league ID to import league information and save your
              auction once done.
            </ContainedListItem>
            <ContainedListItem renderIcon={Trophy} className="game-highlights">
              The official EPL Fantasy draft rules take over for the rest of the
              season.
            </ContainedListItem>
            <ContainedListItem
              renderIcon={ChartCombo}
              className="game-highlights">
              Get auction-specific statistics including how much value you
              extracted from your bids, how many points you lose on the bench,
              how much you would be better or worse off from not doing a
              trasnfer you did, and much more!
            </ContainedListItem>
            <ContainedListItem
              renderIcon={CurrencyPound}
              className="game-highlights">
              Completely free to play, no account needed!
            </ContainedListItem>
          </ContainedList>

          <br />
          <br />

          <Grid>
            <Column lg={4} md={4} sm={4}>
              <ClickableTile href="/auction" renderIcon={ArrowRight} title="">
                Ready to auction? Let's go!
              </ClickableTile>

              <br />

              <ClickableTile
                href="/leaderboard"
                renderIcon={ArrowRight}
                title="">
                If you have already saved your auction, head over to your
                personalized league dashboard here.
              </ClickableTile>
            </Column>
          </Grid>
        </Column>
        <Column
          lg={6}
          md={8}
          sm={4}
          style={{
            height: '100vh',
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/cover.png)`,
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            padding: '50px',
          }}>
          <Grid>
            <Column lg={4} md={4} sm={4}>
              <Tile className="transparent-info-tile">
                <span>
                  We are open source! Consider contributing your feedback,
                  comments, critiques, and even your code, to the project.
                </span>

                <br />
                <br />

                <GitHubButton
                  href="https://github.com/TathagataChakraborti/victims-of-weak-teams"
                  data-size="large"
                  data-show-count="true"
                  aria-label="Stars on GitHub">
                  Star
                </GitHubButton>
              </Tile>
            </Column>

            <Column lg={4} md={4} sm={4}>
              <Tile className="transparent-info-tile">
                <span>
                  The interface is provided for free. If you like it, consider
                  buying me a coffee! Your love keeps us going. &#129303;
                </span>

                <br />
                <br />

                <BuyMeACoffeeButton />
                <BuyMeACoffeeWidget />
              </Tile>
            </Column>
          </Grid>
        </Column>
      </Grid>
    );
  }
}

export default LandingPage;
