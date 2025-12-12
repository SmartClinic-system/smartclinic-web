import nextConfig from "eslint-config-next";

const configs = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

export default configs.map((config) => ({
  ...config,
  rules: {
    ...config.rules,
    "no-unused-vars": "error",
  },
}));
