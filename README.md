# GenAI Docs

A centralized platform for exploring and understanding Generative AI APIs through unified documentation.

## 🚀 Demo

[https://genai-docs.vercel.app/](https://genai-docs.vercel.app/)

## ✨ Key Features

- Access multiple Generative AI API docs in one place
- Clean and consistent documentation UI
- Easy-to-understand docs with code examples
- Real-time documentation updates

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Deployment**: Vercel

## 📅 Roadmap

### Phase 1: OpenAI Documentation (Current)

- [x] Basic documentation structure
- [x] Code examples with syntax highlighting
- [x] Responsive design implementation
- [ ] Complete OpenAI API endpoints coverage
- [ ] Interactive request/response playground
- [ ] Rate limits and pricing information

### Phase 2: Automated Documentation Updates

- [ ] Documentation crawler implementation
- [ ] Automated schema validation
- [ ] Change detection system
- [ ] LLM-powered schema transformation
  - [ ] Automatic conversion to our schema format
  - [ ] Context-aware documentation enhancement
  - [ ] Code example generation
  - [ ] Error handling and edge cases detection
- [ ] Versioning support
- [ ] Automated testing for schema changes
- [ ] Webhook notifications for updates

### Phase 3: Private API Support

- [ ] Swagger/OpenAPI spec import
- [ ] Private documentation hosting
- [ ] Custom domain support
- [ ] Team collaboration features
- [ ] Access control and authentication
- [ ] API key management

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page (API docs list)
│   └── docs/
│       └── [provider]/
│           └── [model]/   # Dynamic routing (API doc detail)
├── entities/              # Domain entities
├── features/             # Feature components
├── shared/              # Shared components/utilities
└── widgets/             # Widget components
```

## 🌟 MVP Features

- [x] Display API documentation list
- [x] Show API documentation details
- [x] Syntax-highlighted code blocks
- [x] Responsive design
- [x] Dark mode support (coming soon)

## 🔧 Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/genai-docs.git
cd genai-docs
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
# .env.local
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

4. Run development server

```bash
pnpm run dev
```

## 📝 Adding API Documentation

1. Add data to the Supabase `api_docs` table in the following format:

```typescript
{
  provider: string;      // API provider (e.g., 'openai')
  model: string;        // Model name (e.g., 'gpt-4')
  schema: {
    schema: {
      meta: {
        title: string;
        method: string;
        endpoint: string;
        description: string;
      };
      headers: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
      request: {
        type: string;
        properties: Record<string, {
          type: string;
          description: string;
          required?: boolean;
        }>;
      };
      response: {
        type: string;
        properties: Record<string, {
          type: string;
          description: string;
        }>;
      };
      examples: {
        request: Record<string, string>;
        response: {
          success: unknown;
        };
      };
    };
  };
}
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

MIT License

---
