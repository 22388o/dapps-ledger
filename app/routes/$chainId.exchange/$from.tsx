import type { LoaderFunction } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';

import { getTokens } from '~/data/tokens';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';
import { isToken } from '~/objects/tokens';

export const loader: LoaderFunction = async ({ params, context: { logger }, request }) => {
  let { from, chainId } = params;

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  const tokens = await getTokens(logger, chainId);

  let to = DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase();

  if (from && !isToken(tokens[chainId])) {
    from = DEFAULT_TOKEN_PAIRS[chainId][0].toLowerCase();
  }

  if (to === from) {
    to = DEFAULT_TOKEN_PAIRS[chainId][0].toLowerCase();
  }

  logger.info('', {
    response_code: 302,
    request: request.url,
    original_url: request.url,
  });
  return redirect(`/exchange/${from}/${to}`);
};

export default function Index() {
  return null;
}
