import type { Logger } from 'winston';
import { SupportedNetworks } from '~/constants';
import type { Token } from '~/objects/tokens';

let lastUpdated: number | null = null;
let tokensMap: Record<SupportedNetworks, Record<string, Token>> = {
  [SupportedNetworks.Ethereum]: {},
  [SupportedNetworks.BSC]: {},
  [SupportedNetworks.Optimism]: {},
  [SupportedNetworks.Polygon]: {},
  [SupportedNetworks.Avalanche]: {},
  [SupportedNetworks.Fantom]: {},
};

const TIMEOUT_3_MIN = 3 * 60 * 1000; //3min

export const getTokens = async (
  logger: Logger,
  chainId: SupportedNetworks
): Promise<Record<SupportedNetworks, Record<string, Token>>> => {
  const isRefetch =
    !Object.keys(tokensMap[chainId]).length ||
    !lastUpdated ||
    Date.now() - lastUpdated > TIMEOUT_3_MIN;

  let tokens: Token[];

  if (isRefetch) {
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/v1/${chainId}/tokens`, {
        headers: {
          'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
        },
      });

      if (response.status === 200) {
        logger.info('', {
          response_code: response.status,
          request: `/v1/${chainId}/tokens`,
        });
      } else {
        const text = await response.text();

        logger.error(text, {
          response_code: response.status,
          request: `/v1/${chainId}/tokens`,
        });
      }

      tokens = (await response.json()).tokens;
    } catch (error) {
      logger.error(`${error}`, {
        response_code: 500,
        request: `/v1/${chainId}/tokens`,
        original_url: '',
      });
      tokens = [];
    }
    tokensMap[chainId] = tokens.reduce(
      (acc, token) => ({
        ...acc,
        [token.address.toLowerCase()]: { ...token, address: token.address.toLowerCase() },
      }),
      {}
    );

    lastUpdated = Date.now();
  }

  return tokensMap;
};
