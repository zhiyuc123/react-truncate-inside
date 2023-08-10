import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Truncate from '../src';

export default {
  title: 'Basic',
  component: Truncate,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    width: {
      table: {
        defaultValue: { 
          summary: 'parentNode.width'
        },
      },
    },
    offset: {
      table: {
        defaultValue: { 
          summary: '8'
        },
      },
    },
    ellipsis: {
      table: {
        defaultValue: { 
          summary: '...'
        },
      },
    },
  },
} as ComponentMeta<typeof Truncate>;

const Template: ComponentStory<typeof Truncate> = (args) => <Truncate {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  text: 'ECMA-402_9th_edition_june_2022.pdf',
  width: 150,
  offset: 8,
  ellipsis: '...'
};


