import { hydrate } from 'react-dom';
import { RemixBrowser } from '@remix-run/react';
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { Buffer } from 'buffer';

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer;
}

Sentry.init({
  dsn: window.ENV.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new BrowserTracing()],
});

hydrate(<RemixBrowser />, document);
