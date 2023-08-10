import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Truncate from '../src';
import './Demo.css';

export default {
  title: 'Demo',
  component: Truncate,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Truncate>;

const Template: ComponentStory<typeof Truncate> = () => {
  const [width, setWidth] = useState(250);
  return (
    <div className="container">
      <h2>Fixed width (150)</h2>
      <div className="wrapper" style={{ width }}>
        <Truncate width={150} text="ECMA-402_9th_edition_june_2022.pdf" />
      </div>

      <h2>Follows the width of the parent element</h2>
      <div>
        <input
          type="range"
          min={0}
          max={500}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </div>
      <div className="wrapper" style={{ width }}>
        <Truncate text="ECMA-402_9th_edition_june_2022.pdf" />
      </div>
    </div>
  );
};

export const Demo = Template.bind({});
Demo.args = {};
