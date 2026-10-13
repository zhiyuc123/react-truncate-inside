# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-10-13

### Fixed

- Text with `offset` greater than or equal to its length no longer gets duplicated characters (for example `a.pdf` used to become `a...pdf`). The text is returned unchanged when nothing in the middle can be removed, and the forced one-character form (`E...2022.pdf`) is only used when it is narrower than the original text.
- Emoji and other surrogate pairs are never split in half: head and tail are now sliced by code point instead of UTF-16 code unit.
- No more `document is not defined` during server-side rendering. The canvas is created lazily in the browser; on the server the full text is rendered.
- No crash in environments without canvas support or without `ResizeObserver` (for example jsdom in consumers' test suites). The component renders the full text and skips measuring.
- The first truncation is applied before the browser paints, so the full text no longer flashes on screen for one frame.
- The element's font is re-read on every measurement and the text is measured again after web fonts finish loading, so truncation no longer uses stale or fallback font metrics.
- `types` now points to the emitted `es/index.d.ts` (it was `es/index.d.js`, which does not exist), so TypeScript consumers get the type declarations.
- The README usage example passes `width` as a number (`width={100}`) instead of a string.

### Changed

- `peerDependencies.react` is `>=16.8.0` (hooks) instead of `>= 16.x.x`.
- One off-screen canvas context is shared by all instances instead of one per instance.
- The truncation algorithm lives in its own pure module (`truncateMiddle`), separated from the React component.
- `npm run build` stops at the first failing step and compiles `.ts` as well as `.tsx` sources into the CommonJS build.
- README rewritten: features, use cases with examples, TypeScript / fill-parent / hover / table examples, corrected props table, how it works, comparison and FAQ. A Chinese README (`README.zh-CN.md`) was added.
- `package.json` description aligned with the README, keywords extended, `author` added.

### Added

- Vitest test suite covering the pure algorithm, the component under jsdom (fake canvas, layout and `ResizeObserver`), the no-canvas fallback and server rendering. `npm test` runs it.
- GitHub Actions CI that runs the tests and the build on every push and pull request; the publish workflow runs the tests before building.
- Documentation site on GitHub Pages deployed with GitHub Actions: a static copy of the README at the site root, the Storybook demo under `/storybook/`, plus `llms.txt`, `llms-full.txt`, `robots.txt` and `sitemap.xml`.
- `LICENSE` file (MIT), GitHub issue templates for bug reports and feature requests, and this changelog.

## [1.0.3] - 2023-08-14

### Fixed

- `package.json`: the `typing` field was renamed to `typings`. (It still pointed to a non-existent `es/index.d.js`; see Unreleased.)

## [1.0.2] - 2023-08-14

### Changed

- README title changed from "React Truncate Middle" to "React Truncate Inside".

## [1.0.1] - 2023-08-14

There is no 1.0.0 release; the version went from 0.2.0 directly to 1.0.1. This version was tagged in git but not published to npm.

### Changed

- Package description changed to "React component for adding an ellipsis to the middle of a line of text."
- `src/` is no longer included in the published package; only the compiled `lib/` (CommonJS) and `es/` (ES modules and type declarations) are shipped.

## [0.2.0] - 2023-08-14

- Version bump only; no code changes compared to 0.1.0.

## [0.1.0] - 2023-08-10

Tagged in git but not published to npm; 0.2.0 is the first version on npm.

### Added

- Initial release of the `Truncate` component with the `text`, `width`, `offset` and `ellipsis` props. Text is measured on an off-screen canvas using the element's computed font and truncated in the middle with a binary search; the element is observed with `ResizeObserver` and re-truncated when its width changes.
- Storybook with a basic story and a demo page, published to GitHub Pages.
- GitHub Actions workflow that publishes the package to npm when a release is created.

[Unreleased]: https://github.com/zhiyuc123/react-truncate-inside/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/zhiyuc123/react-truncate-inside/compare/1.0.3...v1.1.0
[1.0.3]: https://github.com/zhiyuc123/react-truncate-inside/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/zhiyuc123/react-truncate-inside/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/zhiyuc123/react-truncate-inside/compare/0.2.0...1.0.1
[0.2.0]: https://github.com/zhiyuc123/react-truncate-inside/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/zhiyuc123/react-truncate-inside/releases/tag/0.1.0
