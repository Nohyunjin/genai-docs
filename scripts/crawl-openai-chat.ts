import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { ApiDocSchema } from '../src/entities/docs/model/types';

const url = 'https://platform.openai.com/docs/api-reference/chat/create';
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function extractApiDoc(): Promise<ApiDocSchema> {
  // 1. Fetch HTML
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // 2. Extract basic info
  const title = document.querySelector('h1')?.textContent || 'Chat Completion';
  const description =
    document.querySelector('.docs-content p')?.textContent || '';

  // 3. Extract request/response schema
  // Note: This is a simplified version. You'll need to enhance this based on the actual HTML structure
  const schema: ApiDocSchema = {
    meta: {
      title,
      description,
      method: 'POST',
      endpoint: 'https://api.openai.com/v1/chat/completions',
    },
    headers: [
      {
        name: 'Authorization',
        type: 'string',
        required: true,
        description: 'Your OpenAI API key',
      },
    ],
    request: {
      type: 'object',
      properties: {
        // You'll need to extract these from the HTML
        model: {
          type: 'string',
          required: true,
          description: 'ID of the model to use',
        },
        messages: {
          type: 'array',
          required: true,
          description: 'A list of messages comprising the conversation so far',
          properties: {
            role: {
              type: 'string',
              required: true,
              description: 'The role of the messages author',
            },
            content: {
              type: 'string',
              required: true,
              description: 'The contents of the message',
            },
          },
        },
      },
    },
    response: {
      type: 'object',
      properties: {
        // You'll need to extract these from the HTML
        id: {
          type: 'string',
          description: 'The ID of the chat completion',
        },
      },
    },
    examples: {
      request: {
        curl: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Say this is a test!"}],
    "temperature": 0.7
  }'`,
        python: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4",
  messages=[
    {"role": "user", "content": "Say this is a test!"}
  ]
)`,
        javascript: `import OpenAI from 'openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{"role": "user", "content": "Say this is a test!"}],
  temperature: 0.7,
});`,
      },
      response: {
        success: {
          id: 'chatcmpl-123',
          choices: [
            {
              message: {
                role: 'assistant',
                content: 'This is a test!',
              },
            },
          ],
        },
      },
    },
  };

  return schema;
}

async function saveToSupabase(schema: ApiDocSchema) {
  const { error } = await supabase.from('api_docs').upsert({
    provider: 'openai',
    model: 'gpt-4',
    schema,
    updated_at: new Date().toISOString(),
    source_url: url,
  });

  if (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }

  console.log('Successfully saved to Supabase!');
}

async function main() {
  try {
    const schema = await extractApiDoc();
    await saveToSupabase(schema);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
