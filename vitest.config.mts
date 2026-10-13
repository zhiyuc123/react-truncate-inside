import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Component tests need a DOM; the SSR test opts out per file with
    // `// @vitest-environment node`.
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
