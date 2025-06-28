import { HttpMethod, ProviderInfo } from '@/00.shared/types/api-doc';

export function DetailMethodBadge({ method }: { method: HttpMethod }) {
  let colorClasses = 'bg-neutral-700 text-neutral-200';
  switch (method) {
    case HttpMethod.GET:
      colorClasses = 'bg-cyan-600 text-cyan-50';
      break;
    case HttpMethod.POST:
      colorClasses = 'bg-fuchsia-600 text-fuchsia-50';
      break;
    case HttpMethod.PUT:
      colorClasses = 'bg-pink-600 text-pink-50';
      break;
    case HttpMethod.DELETE:
      colorClasses = 'bg-rose-600 text-rose-50';
      break;
  }
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${colorClasses}`}
    >
      {method}
    </span>
  );
}

export function ProviderBadge({ provider }: { provider: ProviderInfo }) {
  let colorClasses = 'bg-neutral-700 text-neutral-200';
  const providerName = provider.name.toLowerCase();

  if (providerName.includes('google')) {
    colorClasses = 'bg-sky-600 text-sky-50';
  } else if (providerName.includes('openai')) {
    colorClasses = 'bg-teal-600 text-teal-50';
  } else if (providerName.includes('anthropic')) {
    colorClasses = 'bg-orange-600 text-orange-50';
  } else if (providerName.includes('mistral')) {
    colorClasses = 'bg-indigo-600 text-indigo-50';
  } else {
    colorClasses = 'bg-slate-600 text-slate-50';
  }

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${colorClasses}`}
    >
      {provider.name}
    </span>
  );
}
