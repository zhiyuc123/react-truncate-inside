# React Truncate Middle

> React component for adding an ellipsis to the middle of a line of text.
>
> Inspired by [pablosichert / react-truncat](https://github.com/pablosichert/react-truncat)

---

## Install

```bash
yarn add react-truncate-middle
```

## Usage

```jsx
import React from 'react';
import Truncate from 'react-truncate-middle';

export default function Demo() {
    return <Truncate text="An-Extremely-Long-Filename.pdf" width="100" />
}
```

[Online Demo](www.todo.com)

## Props

| Name     | Type       | Desc                                                         | Default              |
| -------- | ---------- | ------------------------------------------------------------ | -------------------- |
| text     | `string` |                                                              |                      |
| width    | `number` | Width of the element                                         | `parentNode.width` |
| offset   | `number` | Position(from the end) of the ellipsis that shows in text    | `8`                |
| ellipsis | `string` | Ellipsis that is added into the text in case it is truncated | `'...'`            |

## License

MIT License
