import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

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
    console.log('OpenAILikeProvider getDynamicModels - inputs:', {
      apiKeysProvided: apiKeys ? Object.keys(apiKeys) : 'none',
      settingsProvided: settings ? 'yes' : 'no',
      serverEnvProvided: serverEnv ? Object.keys(serverEnv) : 'none',
    });

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv,
      defaultBaseUrlKey: 'OPENAI_LIKE_API_BASE_URL',
      defaultApiTokenKey: 'OPENAI_LIKE_API_KEY',
    });

    console.log('OpenAILikeProvider getDynamicModels - result:', { 
      baseUrl, 
      apiKeyExists: apiKey ? 'yes' : 'no',
      apiKeyLength: apiKey ? apiKey.length : 0
    });

    if (!baseUrl || !apiKey) {
      console.log('OpenAILikeProvider getDynamicModels - aborting due to missing baseUrl or apiKey');
      return [];
    }

    try {
      // Create a simple headers object that's compatible with Cloudflare Workers
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${apiKey}`);
      
      // Use a minimal fetch request without any problematic options
      console.log(`Attempting fetch to ${baseUrl}/models with Cloudflare-compatible options`);
      const response = await fetch(`${baseUrl}/models`, { 
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = (await response.json()) as any;
      console.log('OpenAILikeProvider getDynamicModels - fetch successful:', { 
        status: response.status,
        modelCount: res.data?.length || 0 
      });

      return res.data.map((model: any) => ({
        name: model.id,
        label: model.id,
        provider: this.name,
        maxTokenAllowed: 8000,
      }));
    } catch (error: any) {
      console.error('OpenAILikeProvider getDynamicModels - fetch error:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace available',
        name: error?.name || 'Unknown error type'
      });
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
