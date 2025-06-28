import { ProviderInfo } from '@/00.shared/types/api-doc';

// 동적 provider 정보 생성 함수
export function createProviderInfo(providerName: string): ProviderInfo {
  const normalizedName = providerName.toLowerCase().replace(/\s+/g, '');

  // 알려진 provider들의 정보
  const knownProviders: Record<string, Omit<ProviderInfo, 'id'>> = {
    openai: { name: 'OpenAI', category: 'llm', logo: '🟢', color: '#10a37f' },
    'google ai': {
      name: 'Google AI',
      category: 'llm',
      logo: '🔵',
      color: '#4285f4',
    },
    googleai: {
      name: 'Google AI',
      category: 'llm',
      logo: '🔵',
      color: '#4285f4',
    },
    anthropic: {
      name: 'Anthropic',
      category: 'llm',
      logo: '🟠',
      color: '#d97706',
    },
    'mistral ai': {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    mistral: {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    mistralai: {
      name: 'Mistral AI',
      category: 'llm',
      logo: '🟣',
      color: '#7c3aed',
    },
    cohere: { name: 'Cohere', category: 'llm', logo: '🟡', color: '#f59e0b' },
    github: { name: 'GitHub', category: 'rest', logo: '⚫', color: '#24292e' },
    stripe: { name: 'Stripe', category: 'rest', logo: '🔷', color: '#635bff' },
    notion: { name: 'Notion', category: 'rest', logo: '⚪', color: '#000000' },
    slack: { name: 'Slack', category: 'rest', logo: '🟪', color: '#4a154b' },
  };

  const providerInfo =
    knownProviders[normalizedName] ||
    knownProviders[providerName.toLowerCase()];

  return {
    id: providerName,
    name: providerInfo?.name || providerName,
    category: providerInfo?.category || 'other',
    logo: providerInfo?.logo || '⚪',
    color: providerInfo?.color || '#6b7280',
  };
}
