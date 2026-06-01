import { Grid, Column, Link } from '@carbon/react';
import { Title, P } from '@carbon-labs/mdx-components';
import { generateUrl } from '../../components/Info';
import { BuyMeACoffeeButton } from '../../components/BasicElements';

const AboutPage = _ => {
  return (
    <Grid>
      <Column
        lg={4}
        md={4}
        sm={4}
        style={{ display: 'flex', justifyContent: 'center' }}
        className="top-relief">
        <div>
          <br />
          <br />
          <img
            alt="MUFC Major"
            src={generateUrl('major')}
            style={{ borderRadius: '100%', width: '250px', height: '250px' }}
          />
        </div>
      </Column>
      <Column lg={10} md={4} sm={4} className="top-relief">
        <Title>Hello there!</Title>
        <br />
        <P>
          I have been playing fantasy football with my friends since I was first
          introduced to the{' '}
          <Link
            href="https://mcdonalds.mediaroom.com/2005-12-08-McDonalds-Announces-Significant-Global-Program-For-The-2006-FIFA-World-Cup"
            target="_blank">
            McDonald's 2006 World Cup fantasy game
          </Link>
          . One of my friends looked at my team and asked:{' '}
          <em>"Who is going to hold the midfield?"</em>.
        </P>
        <P>
          Unfortunately, I win our little league every year. I got tired of
          winning. And I got tired of my friends copying my team, hoping to
          catch up. By the end of the season, our teams will become identical
          (give or take a Kombarov). So the introduction of the{' '}
          <Link href="https://draft.premierleague.com/" target="_blank">
            EPL Fantasy Draft
          </Link>{' '}
          was most welcome: I could finally have my own team.
        </P>
        <P>
          But what is a draft without the thrill of an auction where I can go
          head to head with my friends, bidding for the particular players that{' '}
          <em>only I</em> know would do especially well in the new season. I
          have seen my friends play. They are perpetual victims of weak teams. I
          could not leave my fate at the mercy of a randomized snake-style
          draft.
        </P>
        <P>
          So we ended up hosting, between ourselves, an auction on a shared
          spreadsheet. I recently managed to find a couple of "trailers" I made
          for the first couple of times! [
          <Link
            href={`${process.env.PUBLIC_URL}/videos/trailer.mp4`}
            target="_blank">
            clickme
          </Link>
          ] [
          <Link
            href={`${process.env.PUBLIC_URL}/videos/vowt.mp4`}
            target="_blank">
            clickme
          </Link>
          ] Over time, as my wins continued to rack up, I decided to derive joy
          instead from more constructive pursuits than trailers for shits and
          giggles. I turned the spreadsheet into a proper web application so
          others can enjoy as well. And here we are!
        </P>
        <br />
        <br />
        <BuyMeACoffeeButton />
        <br />
        <br />
        <br />
        <br />
      </Column>
    </Grid>
  );
};

export default AboutPage;
