import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('PollinationsProvider');

interface OpenAILikeResponse {
  data: Array<{ id: string }>;
}

export default class OpenAILikeProvider extends BaseProvider {
  name = 'Pollinations.AI';
  getApiKeyLink = undefined;

  config = {
    baseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
    apiTokenKey: 'OPENAI_LIKE_API_KEY',
  };

  staticModels: ModelInfo[] = [];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    logger.info(`Fetching models for Pollinations.AI with baseUrl: ${baseUrl}`);

    if (!baseUrl || !apiKey) {
      logger.error('Missing baseUrl or apiKey for Pollinations.AI');
      return [];
    }

    try {
      logger.info(`Making request to ${baseUrl}/models`);
      
      // Use the full URL as specified
      const response = await fetch(`https://text.pollinations.ai/openai/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        logger.error(`Error fetching models: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        logger.error(`Error response: ${errorText}`);
        return [];
      }

      const res = await response.json() as unknown;
      logger.info(`Got response from https://text.pollinations.ai/openai/models: ${JSON.stringify(res, null, 2)}`);

      if (!res || typeof res !== 'object' || !('data' in res) || !Array.isArray((res as any).data)) {
        logger.error(`Invalid response format. Expected 'data' array but got: ${JSON.stringify(res)}`);
        return [];
      }

      // Map the response data to ModelInfo objects
      const models = (res as OpenAILikeResponse).data.map(item => ({
        id: item.id,
        name: item.id,
        label: item.id,
        provider: this.name,
        supported: true,
        maxTokenAllowed: 16000, // Default token limit
      }));

      logger.info(`Mapped ${models.length} models from response`);
      return models;
    } catch (error) {
      logger.error(`Exception fetching models: ${error}`);
      return [];
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    if (!baseUrl || !apiKey) {
      throw new Error(`Missing configuration for ${this.name} provider`);
    }

    return getOpenAILikeModel(baseUrl, apiKey, model);
  }
}
