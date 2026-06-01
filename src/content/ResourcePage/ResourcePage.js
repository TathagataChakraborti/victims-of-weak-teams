import React from 'react';
import { LINKS } from './Links';
import { generateUrl } from '../../components/Info';

import { Grid, Column } from '@carbon/react';
import { CardGroup, ResourceCard } from '@carbon-labs/mdx-components';

const ResourcePage = _ => {
  return (
    <Grid>
      <Column lg={16} md={8} sm={4}>
        <CardGroup>
          {LINKS.map((item, id) => (
            <Column lg={4} md={4} sm={4} key={id}>
              <ResourceCard
                actionIcon="arrowRight"
                aspectRatio="2:1"
                href={item.url}
                target="_blank"
                subTitle={item.subtitle}
                title={item.title}>
                <img
                  alt={item.title}
                  src={generateUrl(
                    'images/' + item.title.toLowerCase().replaceAll(' ', '-')
                  )}
                />
              </ResourceCard>
            </Column>
          ))}
        </CardGroup>
        <br />
        <br />
      </Column>
    </Grid>
  );
};

export default ResourcePage;
