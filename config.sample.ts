const ENV = process.env.NODE_ENV || "local";

export const CLIENT_EMAIL = "hello@world.com";
export const CLIENT_PWD = "hello";

export const FB_CONFIG = {
  local: {
    apiKey: "test",
  },

  production: {
    apiKey: "test",
  },
}[ENV];
