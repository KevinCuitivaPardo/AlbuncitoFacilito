import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    // Variables de entorno para los tests: secreto de prueba y SQLite en memoria
    env: { JWT_SECRET: 'test-secret', DATABASE_PATH: ':memory:' },
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
