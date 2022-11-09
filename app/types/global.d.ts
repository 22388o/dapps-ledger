declare global {
  interface Window {
    Buffer: Buffer;
    ENV: {
      SENTRY_DSN: string;
      DEX_ROUTER_API_KEY: string;
      TODAY_TIME: string;
    };
  }
}

export {};
