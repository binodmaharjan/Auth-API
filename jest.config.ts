export default {
  moduleFileExtensions: ["js","ts", "tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "**/tests/**/*.spec.ts",
    "**/tests/**/*.test.ts",
    "**/__tests__/**/*.spec.ts",
    "**/__tests__/**/*.test.ts",
  ],
  testEnvironment: "node",
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/jest/config.ts"]
};