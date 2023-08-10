# React Truncate Middle

> React component for adding an ellipsis to the middle of a line of text.
>
> Inspired by [pablosichert / react-truncate](https://github.com/pablosichert/react-truncate)

[Online Demo](https://zhiyuc123.github.io/react-truncate-inside/?path=/docs/demo--docs)

---

## Install

```bash
npm install react-truncate-inside
```

## Usage

```jsx
import React from 'react';
import Truncate from 'react-truncate-inside';

export default function Demo() {
    return <Truncate text="An-Extremely-Long-Filename.pdf" width="100" />
}
```

## Props

| Name     | Type       | Desc                                                         | Default              |
| -------- | ---------- | ------------------------------------------------------------ | -------------------- |
| text     | `string` |                                                              |                      |
| width    | `number` | Width of the element                                         | `parentNode.width` |
| offset   | `number` | Position(from the end) of the ellipsis that shows in text    | `8`                |
| ellipsis | `string` | Ellipsis that is added into the text in case it is truncated | `'...'`            |

## License

MIT License
