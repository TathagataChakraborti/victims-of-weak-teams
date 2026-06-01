import React from 'react';
import GitHubButton from 'react-github-btn';

import { generateLeagueAPI } from '../../components/Info';

import {
  NumberInput,
  Modal,
  Link,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';

const config = require('../../config.json');

class AuctionInformationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_open: props.props.modal_open,
      league_id: props.props.league_id,
    };
  }

  updateModalState() {
    this.props.updateModalState(false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.props.modal_open !== prevProps.props.modal_open) {
      this.setState({
        ...this.state,
        modal_open: this.props.props.modal_open,
        league_id: this.props.props.league_id,
      });
    }
  }

  render() {
    return (
      <Modal
        passiveModal
        size="lg"
        open={this.state.modal_open}
        modalLabel={
          <>
            This application is powered by the public APIs of the{' '}
            <Link target="_blank" href="https://draft.premierleague.com">
              official FPL Draft
            </Link>
            .
          </>
        }
        modalHeading="Data Sources and Keys"
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        onRequestClose={() => {
          this.updateModalState();
        }}>
        <StructuredListWrapper isCondensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Information</StructuredListCell>
              <StructuredListCell head>API</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell noWrap>Static Data</StructuredListCell>
              <StructuredListCell>
                <Link href={config.static_api} target="_blank">
                  {config.static_api}
                </Link>
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>League Data</StructuredListCell>
              <StructuredListCell>
                <Link
                  href={generateLeagueAPI(this.state.league_id)}
                  target="_blank">
                  {generateLeagueAPI(this.state.league_id)}
                </Link>
                <br />
                <br />
                <NumberInput
                  style={{ width: '25%' }}
                  hideSteppers
                  allowEmpty
                  size="sm"
                  value={this.state.league_id}
                  onChange={e => {
                    this.setState({
                      ...this.state,
                      league_id: e.target.value,
                    });
                  }}
                  id="league_id_secondary"
                  helperText="Value of {LEAGUE ID}"
                  placeholder={config.default_league_id}
                />

                <br />
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
        <br />
        <br />

        <StructuredListWrapper isCondensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Acronym</StructuredListCell>
              <StructuredListCell head>Name</StructuredListCell>
              <StructuredListCell head>Details</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell noWrap>DR</StructuredListCell>
              <StructuredListCell>Draft Rank</StructuredListCell>
              <StructuredListCell>
                To help you decide which players to draft, the Premier League
                has ranked all the players based on their projected points
                during the season. Each player is ranked, with the player with
                the most projected points ranked first.
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>IR</StructuredListCell>
              <StructuredListCell>Influence Rank</StructuredListCell>
              <StructuredListCell>
                Influence evaluates the degree to which a player has made an
                impact on a single match or throughout the season. It takes into
                account events and actions that could directly or indirectly
                effect the outcome of the fixture. At the top level these are
                decisive actions like goals and assists. But the Influence score
                also processes significant defensive actions to analyse the
                effectiveness of defenders and goalkeepers.
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>CR</StructuredListCell>
              <StructuredListCell>Creativity Rank</StructuredListCell>
              <StructuredListCell>
                Creativity assesses player performance in terms of producing
                goalscoring opportunities for others. It can be used as a guide
                to identify the players most likely to supply assists. While
                this analyses frequency of passing and crossing, it also
                considers pitch location and quality of the final ball.
              </StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>TR</StructuredListCell>
              <StructuredListCell>Threat Rank</StructuredListCell>
              <StructuredListCell>
                This is a value that examines a player's threat on goal. It
                gauges the individuals most likely to score goals. While
                attempts are the key action, the Index looks at pitch location,
                giving greater weight to actions that are regarded as the best
                chances to score.
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>

        <br />
        <p>
          All three of these scores are combined to create an overall{' '}
          <Link target="_blank" href="https://www.premierleague.com/news/65567">
            ICT Index Score
          </Link>
          . That then offers a single figure that presents a view on that player
          as an FPL asset, especially relative to others in the same position in
          FPL.
        </p>
        <br />
        <GitHubButton
          href="https://github.com/TathagataChakraborti/victims-of-weak-teams"
          data-size="large"
          data-show-count="true"
          aria-label="Stars on GitHub">
          Star
        </GitHubButton>
      </Modal>
    );
  }
}

export { AuctionInformationModal };
