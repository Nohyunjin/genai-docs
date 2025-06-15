# GenAI Docs

**Explore APIs. Make them yours.**

A next-generation platform for searching, exploring, and instantly utilizing Generative AI APIs—better organized, easier to understand, and ready to use with copy-pastable code examples.

---

🚀 **Demo**  
https://genai-docs.vercel.app/

---

## ✨ Why GenAI Docs?

- **Faster API Search:** Instantly find the API you need with powerful filtering by provider, model, endpoint, or method.
- **Unified, Readable Docs:** All your favorite AI APIs in one place—clean, consistent, and free from clutter.
- **Ready-to-Use Code Examples:** Get copy-ready snippets (cURL, JS, Python) for every endpoint.
- **Always Up-to-date:** Documentation that keeps pace with the latest API changes.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React, TypeScript
- **Styling:** TailwindCSS
- **Backend:** Supabase
- **Deployment:** Vercel

---

## 📅 Roadmap

### **Phase 1: Unified AI API Explorer (Current)**
- Full OpenAI API coverage
- Instant search and advanced filtering
- Clean documentation UI
- Syntax-highlighted code blocks
- Responsive design

### **Phase 2: Automated Documentation & Enrichment**
- Documentation crawler for auto-updates
- Schema validation & change detection
- LLM-powered schema transformation
- Auto-generated code examples
- Version history & diff viewer
- Webhook notifications for updates

### **Phase 3: Bring Your Own Docs**
- Swagger/OpenAPI import
- Private API support & hosting
- Team collaboration & access control
- Custom domains

---

## 🌟 MVP Features

- Unified API documentation list & instant search
- API details page with method, endpoint, schema, and examples
- Syntax-highlighted, ready-to-use code blocks
- Responsive design
- Dark mode (coming soon)

---

## 🔧 Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/genai-docs.git
   cd genai-docs
  
2. **Install dependencies**

   ```sh
   pnpm install

3. **Set up environment variables**

   ```
   # .env.local
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
4. **Run the development server**
   ```sh
   pnpm run dev
   ```

---

## 📝 Adding API Documentation

Insert data into the Supabase `api_docs` table with the following schema:

```typescript
{
  provider: string;      // API provider (e.g., 'openai')
  model: string;         // Model name (e.g., 'gpt-4')
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
}
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📜 License

MIT License

---

