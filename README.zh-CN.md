# react-truncate-inside

[English](./README.md) | 简体中文

**react-truncate-inside** 是一个在文本中间显示省略号的 React 组件：文件名、哈希值、钱包地址这类长字符串会保留开头和结尾，只把中间放不下的部分换成省略号。省略位置按实际渲染宽度测量得出，容器尺寸变化时会自动重新计算。

[![npm version](https://img.shields.io/npm/v/react-truncate-inside.svg)](https://www.npmjs.com/package/react-truncate-inside)
[![npm downloads](https://img.shields.io/npm/dm/react-truncate-inside.svg)](https://www.npmjs.com/package/react-truncate-inside)
[![license](https://img.shields.io/npm/l/react-truncate-inside.svg)](#license)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-truncate-inside)](https://bundlephobia.com/package/react-truncate-inside)

![react-truncate-inside 演示：容器宽度变化时文件名在中间被截断](https://github.com/zhiyuc123/react-truncate-inside/assets/46096473/a8529b7c-575b-4656-8802-5b5a940c9964)

[在线 Demo](https://zhiyuc123.github.io/react-truncate-inside/storybook/?path=/docs/demo--docs) · [文档站](https://zhiyuc123.github.io/react-truncate-inside/)

> 灵感来自 [pablosichert/react-truncate](https://github.com/pablosichert/react-truncate)，它做的是末尾截断。

---

## 特性

- **中间截断。** 保留文本开头和末尾 `offset` 个字符（默认 8 个），中间放不下的部分替换为 `ellipsis`（默认 `...`）。
- **按真实宽度测量。** 用离屏 canvas 按元素的计算样式字体（字重、字形、字号、字体族）测量文本宽度，结果以实际像素为准，而不是按字符数估算。
- **响应式。** 容器尺寸变化（`ResizeObserver`）、`width` 或 `text` 属性变化、Web 字体加载完成，都会触发重新截断。
- **Unicode 安全。** 按码点切分，emoji 等代理对不会被切成两半。
- **支持服务端渲染。** 渲染过程不访问 `document` 和 `window`，服务端输出完整文本，浏览器挂载后再截断。
- **TypeScript。** 自带类型声明，并导出 `TruncateProps` 接口。
- **体积小。** 零运行时依赖，压缩加 gzip 后约 1 kB，同时提供 CommonJS 和 ES Module 两种产物。需要 React 16.8 及以上（使用了 hooks）。

## 适用场景

只要字符串的结尾承载信息（扩展名、校验和、用来区分相似值的最后几位），就适合用中间截断。结尾保留几个字符由 `offset` 决定，开头能保留多少取决于可用宽度。

| 场景     | 原文                                                           | 截断后                                  | `offset` |
| -------- | -------------------------------------------------------------- | --------------------------------------- | -------- |
| 文件名   | `ECMA-402_9th_edition_june_2022.pdf`                           | `ECMA-402_9th...2022.pdf`               | `8`      |
| 哈希值   | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`                     | `a94a8fe5cc...2fbbd3`                   | `6`      |
| 钱包地址 | `0x71C7656EC7ab88b098defB751B7401B5f6d8976F`                   | `0x71C7656E...976F`                     | `4`      |
| URL      | `https://example.com/docs/guides/getting-started/installation` | `https://example.com/do...installation` | `12`     |
| 文件路径 | `/Users/alice/Projects/client/src/components/Header.tsx`       | `/Users/alice/Proj...Header.tsx`        | `10`     |

## 安装

```bash
npm install react-truncate-inside
# 或
yarn add react-truncate-inside
# 或
pnpm add react-truncate-inside
```

## 快速上手

```jsx
import React from 'react';
import Truncate from 'react-truncate-inside';

export default function Demo() {
  return <Truncate text="An-Extremely-Long-Filename.pdf" width={100} />;
}
```

渲染出一个 100 px 宽的元素，内容类似 `An-...name.pdf`，开头能保留几个字符取决于字体。

## 示例

### TypeScript

默认导出自带类型，属性接口以 `TruncateProps` 的名字导出。

```tsx
import React from 'react';
import Truncate from 'react-truncate-inside';
import type { TruncateProps } from 'react-truncate-inside';

type FileNameProps = Pick<TruncateProps, 'width'> & { name: string };

export function FileName({ name, width }: FileNameProps) {
  // 保留扩展名以及它前面的几个字符
  return <Truncate text={name} width={width} offset={8} />;
}
```

### 撑满父元素并跟随其宽度

不传 `width` 时元素占满父元素宽度。`ResizeObserver` 会在宽度变化时重新截断，比如拖动侧边栏或调整窗口大小。

```jsx
function Sidebar({ fileName }) {
  return (
    <aside style={{ width: '20vw' }}>
      <Truncate text={fileName} />
    </aside>
  );
}
```

### 鼠标悬停显示完整文本

组件只渲染一个 `div`，不透传额外属性，所以把 `title` 放在外层元素上。

```jsx
function FileLabel({ fileName }) {
  return (
    <span title={fileName}>
      <Truncate text={fileName} width={160} />
    </span>
  );
}
```

### 在表格单元格中使用

给列设置宽度（或使用 `table-layout: fixed`）。自动表格布局下单元格会被完整文本撑开，也就没有东西可截断。

```jsx
function FileTable({ files }) {
  return (
    <table style={{ tableLayout: 'fixed', width: '100%' }}>
      <colgroup>
        <col style={{ width: '60%' }} />
        <col style={{ width: '40%' }} />
      </colgroup>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td>
              <Truncate text={file.name} />
            </td>
            <td>{file.size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Props

| 属性       | 类型     | 默认值               | 说明                                                                    |
| ---------- | -------- | -------------------- | ----------------------------------------------------------------------- |
| `text`     | `string` | 必填                 | 要显示的文本。                                                          |
| `width`    | `number` | 父元素宽度（`100%`） | 元素宽度，单位 px。不传时元素占满父元素，并在父元素尺寸变化时重新截断。 |
| `offset`   | `number` | `8`                  | 末尾保留的字符数，省略号插在距结尾这么多个字符的位置。                  |
| `ellipsis` | `string` | `'...'`              | 替换被移除字符的字符串，只在文本确实被截断时出现。                      |

组件渲染为 `<div style="width: <width>px 或 100%; white-space: nowrap">`，唯一的子节点是（可能被截断的）文本。

## 工作原理

组件把文本渲染在一个 `white-space: nowrap` 的 `div` 里，用一个离屏 `<canvas>` 2D 上下文测量宽度，上下文的 `font` 设为该元素的计算样式字体。如果文本比元素宽，就用二分查找找出最长的前缀，使得 `前缀 + ellipsis + 末尾 offset 个字符` 刚好放得下。元素尺寸变化、`width` 或 `text` 属性变化、`document.fonts` 报告 Web 字体加载完成时，都会重新测量。

需要了解的限制：

- 只支持单行，多行省略不在范围内。
- canvas 测量只使用 `font-weight`、`font-style`、`font-size`、`font-family`，不考虑元素上的 `letter-spacing` 和 `text-transform`。
- 如果元素比"1 个字符 + 省略号 + 末尾 `offset` 个字符"还窄，会渲染这个最小形式并溢出，组件本身不设置 `overflow: hidden`。
- 没有 `ResizeObserver` 的环境下组件仍能渲染，挂载时和属性变化时会截断，但不响应容器尺寸变化。

## 方案对比

| 方案                          | 省略号位置                                   | 跟随宽度变化             | 说明                                                                       |
| ----------------------------- | -------------------------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `react-truncate-inside`       | 中间，保留末尾 `offset` 个字符               | 支持（`ResizeObserver`） | 仅单行。约 1 kB，零依赖，自带 TypeScript 类型。                            |
| CSS `text-overflow: ellipsis` | 只能在末尾（配合 `direction: rtl` 可在开头） | 原生支持                 | 不需要 JavaScript，兼容所有字体特性。能接受隐藏结尾时这是最合适的选择。    |
| `react-truncate`              | 末尾，可限制为若干行                         | 支持                     | 覆盖多行"展开更多"式的截断，本库不做这件事。                               |
| 手写测量代码                  | 任意位置                                     | 取决于你的实现           | 完全可控，但字体测量、resize、Web 字体加载、码点、服务端渲染都要自己处理。 |

## 常见问题

### 为什么不直接用 CSS 的 `text-overflow: ellipsis`？

因为 CSS 只能把省略号放在文本末尾（配合 `direction: rtl` 可以放在开头），没有"中间"这个选项，文件扩展名或地址的结尾会最先被隐藏。结尾不重要时用 CSS，结尾重要时才需要中间截断组件。

### 容器大小变化时会重新截断吗？

会。元素通过 `ResizeObserver` 观察自身尺寸，宽度一变就重新截断，拖动分隔条、调整窗口大小都包括在内。修改 `width` 或 `text` 属性同样会触发重新测量。

### 支持 SSR / Next.js 吗？

支持。服务端渲染时组件输出完整文本，不访问 `document` 和 `window`；截断在浏览器端挂载后的 layout effect 中计算，发生在首次绘制之前。不需要动态导入，也不需要 `ssr: false`。

### 能保证文件扩展名一直显示吗？

能，`offset` 就是干这个的：它是末尾保留的字符数，默认 8。对 `.pdf`、`.png` 这类文件，默认值已经能保留扩展名加前面 4 个字符；遇到 `.tar.gz` 这类较长的扩展名，或结尾需要更多上下文时，把它调大即可。

### 为什么在表格里文本没有被截断？

因为自动表格布局下单元格会被完整文本撑开，元素永远不会溢出。给表格设置 `table-layout: fixed` 并指定列宽，或者给单元格一个明确的 `max-width`。

### 支持多行吗？

不支持。组件是单行的（`white-space: nowrap`）。需要多行末尾省略时，用 CSS 的 `-webkit-line-clamp` 或 `react-truncate` 这类库。

## License

MIT License
