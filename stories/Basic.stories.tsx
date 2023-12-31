import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import Truncate from '../src';

export default {
  title: 'Truncate',
  component: Truncate,
  parameters: {
    // layout: 'fullscreen',
  },
  argTypes: {
    width: {
      table: {
        defaultValue: {
          summary: 'parentNode.width',
        },
      },
    },
    offset: {
      table: {
        defaultValue: {
          summary: '8',
        },
      },
    },
    ellipsis: {
      table: {
        defaultValue: {
          summary: '...',
        },
      },
    },
  },
} as Meta<typeof Truncate>;

const Template: StoryFn<typeof Truncate> = (args) => <Truncate {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  text: 'ECMA-402_9th_edition_june_2022.pdf',
  width: 150,
  offset: 8,
  ellipsis: '...',
};
