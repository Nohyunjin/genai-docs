import { ApiDocSchema } from '../types';

export const chatCompletionReference: ApiDocSchema = {
  meta: {
    title: 'Chat Completion',
    description: 'Creates a model response for the given chat conversation.',
    method: 'POST',
    endpoint: 'https://bridge.luxiacloud.com/llm/saltlux/hanson/v1/chat',
  },

  headers: [
    {
      name: 'api_key',
      type: 'string',
      required: true,
      description: 'Your API key for authentication',
    },
  ],

  request: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        required: true,
        description:
          'Model ID to use. (luxia2.5-8b-instruct, luxia2.5-32b-instruct)',
        example: 'luxia2-8b-instruct',
      },
      messages: {
        type: 'array',
        required: true,
        description: 'Array of messages in the conversation',
        properties: {
          role: {
            type: 'string',
            required: true,
            description: 'Role of the message author (system, user, assistant)',
          },
          content: {
            type: 'string',
            required: true,
            description: 'Content of the message',
          },
        },
      },
      temperature: {
        type: 'number',
        required: false,
        description: 'Sampling temperature between 0 and 1',
        default: 0,
      },
      max_token: {
        type: 'number',
        required: false,
        description: 'Maximum number of tokens to generate',
        default: 512,
      },
      stop: {
        type: 'array',
        required: false,
        description: 'List of strings to stop generation',
        properties: {
          stop_string: {
            type: 'string',
            required: true,
          },
        },
        default: [],
      },
      top_p: {
        type: 'number',
        required: false,
        description: 'Nucleus sampling threshold between 0 and 1',
        default: 1,
      },
      frequency_penalty: {
        type: 'number',
        required: false,
        description: 'Frequency penalty between 0 and 2',
        default: 0,
      },
      stream: {
        type: 'boolean',
        required: false,
        description: 'Whether to stream the response',
        default: false,
      },
    },
  },

  response: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Unique identifier for the completion',
      },
      choices: {
        type: 'array',
        properties: {
          message: {
            type: 'object',
            properties: {
              role: {
                type: 'string',
                description: 'Role of the message author',
              },
              content: {
                type: 'string',
                description: 'The generated message content',
              },
            },
          },
        },
      },
    },
  },

  examples: {
    request: {
      curl: `curl --location 'https://bridge.luxiacloud.com/llm/saltlux/hanson/v1/chat' \\
--header 'apikey: YOUR_API_KEY' \\
--header 'Content-Type: application/json' \\
-d '{
  "model": "luxia2.5-8b-instruct",
  "messages": [
    {
      "role": "user",
      "content": "안녕하세요"
    }
  ],
  "stream": true,
  "temperature": 0,
  "max_token": 2048,
  "top_p": 1,
  "frequency_penalty": 0.1,
  "stop": []
}'`,
      python: `import luxia

client = luxia.Client()
response = client.chat.create(
    model="luxia2-8b-instruct",
    messages=[{"role": "user", "content": "안녕하세요"}]
)`,
      javascript: `const response = await fetch('https://bridge.luxiacloud.com/llm/saltlux/hanson/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: "luxia2.5-8b-instruct",
    messages: [
      {
        role: "user",
        content: "안녕하세요"
      }
    ],
    stream: true,
    temperature: 0,
    max_token: 2048,
    top_p: 1,
    frequency_penalty: 0.1,
    stop: []
  })
});

const data = await response.json();`,
    },
    response: {
      success: {
        id: 'chat-123',
        choices: [
          {
            message: {
              role: 'assistant',
              content: '안녕하세요! 무엇을 도와드릴까요?',
            },
          },
        ],
      },
    },
  },
};
