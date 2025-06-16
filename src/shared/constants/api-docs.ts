import {
  ApiDocSchema,
  APIDocument,
  APIProvider,
  CodeLanguage,
  HttpMethod,
} from '../types/api-doc';

const geminiFlashSchema: ApiDocSchema = {
  meta: {
    title: 'Generate Content with Gemini Flash',
    method: HttpMethod.POST,
    endpoint: '/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent',
    description:
      "The Gemini Flash model is Google's fastest and most cost-effective multimodal model. It's optimized for high-volume, fast-response scenarios such as summarization, chat applications, image and video captioning, and data extraction from documents and tables. It supports text, image, and audio input, and generates text output.",
  },
  headers: [
    {
      name: 'Content-Type',
      type: 'string',
      description: 'Set to `application/json`.',
      required: true,
    },
    {
      name: 'X-Goog-Api-Key',
      type: 'string',
      description: 'Your Google AI API key.',
      required: true,
    },
  ],
  request: {
    description:
      'The request body contains the content to be processed by the model.',
    type: 'object',
    properties: {
      contents: {
        type: 'array',
        description:
          'An array of Content objects. Each Content object contains a list of Parts.',
        required: true,
        items: {
          type: 'object',
          description:
            'A single Content object, typically representing a turn in a conversation or a prompt.',
          properties: {
            role: {
              type: 'string',
              description:
                'The role of the entity that is providing the Content. Allowed values are `user` and `model`.',
              example: 'user',
            },
            parts: {
              type: 'array',
              description:
                'An array of Part objects. Each Part can be text, inline data (image/audio bytes), or a file URI.',
              required: true,
              items: {
                type: 'object',
                description:
                  'A single Part object, representing a piece of text, media, or file data.',
                properties: {
                  text: {
                    type: 'string',
                    description: 'Plain text input.',
                    example: 'Tell me a joke.',
                  },
                  inlineData: {
                    type: 'object',
                    description:
                      'Serialized bytes of media data, Base64 encoded.',
                    properties: {
                      mimeType: {
                        type: 'string',
                        description:
                          'The IANA MIME type of the media, e.g., `image/png`.',
                        example: 'image/jpeg',
                      },
                      data: {
                        type: 'string',
                        description: 'Base64 encoded data.',
                        example: 'iVBORw0KGgoAAAANSUhEUg...',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      generationConfig: {
        type: 'object',
        description: 'Configuration options for model generation and outputs.',
        properties: {
          temperature: {
            type: 'number',
            description:
              'Controls randomness. Lower for more deterministic, higher for more creative. Range: 0.0 to 1.0.',
            default: 0.9,
            example: 0.7,
          },
          topK: {
            type: 'integer',
            description:
              'The maximum number of tokens to consider when sampling.',
            example: 1,
          },
          topP: {
            type: 'number',
            description:
              'The maximum cumulative probability of tokens to consider when sampling.',
            example: 1.0,
          },
          maxOutputTokens: {
            type: 'integer',
            description: 'The maximum number of tokens to generate.',
            default: 2048,
            example: 256,
          },
          stopSequences: {
            type: 'array',
            items: {
              type: 'string',
              description:
                'A string that will cause the model to stop generating tokens.',
            },
            description:
              'Sequences where the API will stop generating further tokens.',
          },
        },
      },
      safetySettings: {
        type: 'array',
        description:
          'A list of unique SafetySetting instances for blocking unsafe content.',
        items: {
          type: 'object',
          description:
            'A safety setting configuration for a specific harm category.',
          properties: {
            category: {
              type: 'string',
              description: 'The category for safety setting.',
              enum: [
                'HARM_CATEGORY_HARASSMENT',
                'HARM_CATEGORY_HATE_SPEECH',
                'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'HARM_CATEGORY_DANGEROUS_CONTENT',
              ],
            },
            threshold: {
              type: 'string',
              description:
                'Controls the probability threshold at which harm is blocked.',
              enum: [
                'BLOCK_NONE',
                'BLOCK_ONLY_HIGH',
                'BLOCK_MEDIUM_AND_ABOVE',
                'BLOCK_LOW_AND_ABOVE',
              ],
            },
          },
        },
      },
    },
  },
  response: {
    success: {
      statusCode: '200 OK',
      description: 'Successful response containing the generated content.',
      schema: {
        type: 'object',
        properties: {
          candidates: {
            type: 'array',
            description:
              'A list of generated candidate responses from the model.',
            items: {
              type: 'object',
              description:
                'A single candidate response generated by the model.',
              properties: {
                content: {
                  type: 'object',
                  description:
                    "The content part of the candidate, usually containing the model's response.",
                  properties: {
                    parts: {
                      type: 'array',
                      description:
                        'An array of Part objects, typically containing text.',
                      items: {
                        type: 'object',
                        description:
                          'A single Part object, usually containing generated text.',
                        properties: {
                          text: {
                            type: 'string',
                            description: 'The generated text.',
                          },
                        },
                      },
                    },
                    role: { type: 'string', description: 'Usually "model".' },
                  },
                },
                finishReason: {
                  type: 'string',
                  description:
                    'Reason generation stopped (e.g., "STOP", "MAX_TOKENS").',
                },
                safetyRatings: {
                  type: 'array',
                  description:
                    'A list of safety ratings for the candidate response.',
                  items: {
                    type: 'object',
                    description:
                      'A safety rating for a specific harm category and its probability.',
                    properties: {
                      category: {
                        type: 'string',
                        description: 'Safety category.',
                      },
                      probability: {
                        type: 'string',
                        description: 'Harm probability.',
                      },
                    },
                  },
                },
              },
            },
          },
          promptFeedback: {
            type: 'object',
            description: 'Feedback regarding the safety of the prompt.',
            properties: {
              blockReason: {
                type: 'string',
                description: 'If the prompt was blocked, the reason why.',
              },
              safetyRatings: {
                type: 'array',
                description: 'Safety ratings for the prompt.',
                items: {
                  type: 'object',
                  description:
                    'A safety rating for a specific harm category and its probability for the prompt.',
                },
              },
            },
          },
        },
      },
    },
  },
  examples: {
    request: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=YOUR_API_KEY' \\
    -H 'Content-Type: application/json' \\
    -X POST \\
    -d '{
      "contents": [{
        "parts":[{"text": "Explain quantum computing in simple terms."}]
      }],
      "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 150
      }
    }'`,
      },
      {
        language: CodeLanguage.JAVASCRIPT,
        label: 'Node.js',
        code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: "Explain quantum computing in simple terms.",
    config: {
      temperature: 0.7,
      maxOutputTokens: 150
    }
  });
  console.log(response.text);
}

run();`,
      },
      {
        language: CodeLanguage.PYTHON,
        label: 'Python',
        code: `import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17')
response = model.generate_content(
    "Explain quantum computing in simple terms.",
    generation_config=genai.types.GenerationConfig(
        temperature=0.7,
        max_output_tokens=150
    )
)
print(response.text)`,
      },
    ],
    response: [
      {
        language: CodeLanguage.JSON,
        label: 'JSON',
        code: JSON.stringify(
          {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: "Imagine a regular computer uses bits, which are like light switches that are either ON (1) or OFF (0). Quantum computers use 'qubits'. A qubit is like a dimmer switch that can be ON, OFF, or somewhere in between. It can even be both ON and OFF at the same time (superposition)!\\n\\nThis 'quantum weirdness' allows quantum computers to do many calculations at once, making them incredibly fast for certain problems that are too hard for regular computers, like discovering new medicines or breaking complex codes.",
                    },
                  ],
                  role: 'model',
                },
                finishReason: 'STOP',
                index: 0,
                safetyRatings: [
                  {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    probability: 'NEGLIGIBLE',
                  },
                  {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    probability: 'NEGLIGIBLE',
                  },
                  {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    probability: 'NEGLIGIBLE',
                  },
                  {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    probability: 'NEGLIGIBLE',
                  },
                ],
              },
            ],
            promptFeedback: {
              safetyRatings: [
                {
                  category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                  probability: 'NEGLIGIBLE',
                },
                {
                  category: 'HARM_CATEGORY_HATE_SPEECH',
                  probability: 'NEGLIGIBLE',
                },
                {
                  category: 'HARM_CATEGORY_HARASSMENT',
                  probability: 'NEGLIGIBLE',
                },
                {
                  category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                  probability: 'NEGLIGIBLE',
                },
              ],
            },
          },
          null,
          2
        ),
      },
    ],
  },
};

const openaiGpt4oSchema: any = {
  meta: {
    title: 'Create Chat Completion with GPT-4o',
    method: HttpMethod.POST,
    endpoint: '/v1/chat/completions',
    description:
      "Creates a model response for the given chat conversation using GPT-4o, OpenAI's most advanced multimodal model.",
  },
  headers: [
    {
      name: 'Content-Type',
      type: 'string',
      description: 'Set to `application/json`.',
      required: true,
    },
    {
      name: 'Authorization',
      type: 'string',
      description: 'Bearer token authentication with your OpenAI API key.',
      required: true,
    },
  ],
  request: {
    description:
      'The request body contains the chat messages and configuration.',
    type: 'object',
    properties: {
      model: {
        type: 'string',
        description: 'ID of the model to use.',
        required: true,
        example: 'gpt-4o',
      },
      messages: {
        type: 'array',
        description: 'A list of messages comprising the conversation so far.',
        required: true,
        items: {
          type: 'object',
          description: 'A single message in the conversation.',
          properties: {
            role: {
              type: 'string',
              description: 'The role of the messages author.',
              enum: ['system', 'user', 'assistant', 'tool'],
            },
            content: {
              type: 'string',
              description: 'The contents of the message.',
              example: 'Hello, how can I help you today?',
            },
          },
        },
      },
      max_tokens: {
        type: 'integer',
        description: 'The maximum number of tokens to generate.',
        example: 150,
      },
      temperature: {
        type: 'number',
        description: 'Controls randomness. 0 is deterministic, 1 is creative.',
        default: 1,
        example: 0.7,
      },
      top_p: {
        type: 'number',
        description: 'Nucleus sampling parameter.',
        default: 1,
        example: 0.9,
      },
    },
  },
  response: {
    success: {
      statusCode: '200 OK',
      description: 'Successful response containing the chat completion.',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the chat completion.',
          },
          object: {
            type: 'string',
            description: 'Object type, always "chat.completion".',
          },
          created: {
            type: 'integer',
            description: 'Unix timestamp of creation time.',
          },
          model: {
            type: 'string',
            description: 'The model used for completion.',
          },
          choices: {
            type: 'array',
            description: 'List of completion choices returned by the model.',
            items: {
              type: 'object',
              description: 'A single completion choice.',
              properties: {
                index: { type: 'integer', description: 'Choice index.' },
                message: {
                  type: 'object',
                  description: 'The message object containing the completion.',
                  properties: {
                    role: {
                      type: 'string',
                      description: 'Role of the message author.',
                    },
                    content: {
                      type: 'string',
                      description: 'The actual completion text.',
                    },
                  },
                },
                finish_reason: {
                  type: 'string',
                  description: 'Reason the completion finished.',
                },
              },
            },
          },
          usage: {
            type: 'object',
            description: 'Usage statistics for the completion request.',
            properties: {
              prompt_tokens: {
                type: 'integer',
                description: 'Tokens in the prompt.',
              },
              completion_tokens: {
                type: 'integer',
                description: 'Tokens in the completion.',
              },
              total_tokens: {
                type: 'integer',
                description: 'Total tokens used.',
              },
            },
          },
        },
      },
    },
  },
  examples: {
    request: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is quantum computing?"}
    ],
    "max_tokens": 150,
    "temperature": 0.7
  }'`,
      },
      {
        language: CodeLanguage.JAVASCRIPT,
        label: 'Node.js',
        code: `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is quantum computing?"}
    ],
    model: "gpt-4o",
    max_tokens: 150,
    temperature: 0.7,
  });

  console.log(completion.choices[0].message.content);
}

main();`,
      },
    ],
    response: [
      {
        language: CodeLanguage.JSON,
        label: 'JSON',
        code: JSON.stringify(
          {
            id: 'chatcmpl-123',
            object: 'chat.completion',
            created: 1677652288,
            model: 'gpt-4o',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content:
                    "Quantum computing is a revolutionary technology that uses quantum mechanics principles to process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or 'qubits' that can exist in multiple states simultaneously through superposition.",
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 20,
              completion_tokens: 45,
              total_tokens: 65,
            },
          },
          null,
          2
        ),
      },
    ],
  },
};

const claudeOpusSchema: ApiDocSchema = {
  meta: {
    title: 'Create Message with Claude 3 Opus',
    method: HttpMethod.POST,
    endpoint: '/v1/messages',
    description:
      'Send a structured list of input messages with text and/or image content, and the model will generate the next message in the conversation.',
  },
  headers: [
    {
      name: 'Content-Type',
      type: 'string',
      description: 'Set to `application/json`.',
      required: true,
    },
    {
      name: 'x-api-key',
      type: 'string',
      description: 'Your Anthropic API key.',
      required: true,
    },
    {
      name: 'anthropic-version',
      type: 'string',
      description: 'API version to use.',
      required: true,
      example: '2023-06-01',
    },
  ],
  request: {
    description:
      'The request body contains the messages and configuration for Claude.',
    type: 'object',
    properties: {
      model: {
        type: 'string',
        description: 'The model that will complete your prompt.',
        required: true,
        example: 'claude-3-opus-20240229',
      },
      max_tokens: {
        type: 'integer',
        description:
          'The maximum number of tokens to generate before stopping.',
        required: true,
        example: 1024,
      },
      messages: {
        type: 'array',
        description: 'Input messages for the conversation.',
        required: true,
        items: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              description: 'The role of the message author.',
              enum: ['user', 'assistant'],
            },
            content: {
              type: 'string',
              description: 'The content of the message.',
              example: 'Hello, Claude!',
            },
          },
        },
      },
      temperature: {
        type: 'number',
        description: 'Amount of randomness injected into the response.',
        default: 1.0,
        example: 0.7,
      },
      top_p: {
        type: 'number',
        description: 'Use nucleus sampling.',
        example: 0.9,
      },
      stop_sequences: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Custom text sequences that will cause the model to stop generating.',
      },
    },
  },
  response: {
    success: {
      statusCode: '200 OK',
      description: 'Successful response containing the message completion.',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique object identifier.' },
          type: {
            type: 'string',
            description: 'Object type, always "message".',
          },
          role: {
            type: 'string',
            description: 'Conversational role, always "assistant".',
          },
          content: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Content type, always "text".',
                },
                text: {
                  type: 'string',
                  description: 'The actual response text.',
                },
              },
            },
          },
          model: {
            type: 'string',
            description: 'The model that handled the request.',
          },
          stop_reason: {
            type: 'string',
            description: 'The reason that we stopped.',
          },
          stop_sequence: {
            type: 'string',
            description: 'Which custom stop sequence was generated, if any.',
          },
          usage: {
            type: 'object',
            properties: {
              input_tokens: {
                type: 'integer',
                description: 'The number of input tokens.',
              },
              output_tokens: {
                type: 'integer',
                description: 'The number of output tokens.',
              },
            },
          },
        },
      },
    },
  },
  examples: {
    request: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-opus-20240229",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'`,
      },
      {
        language: CodeLanguage.PYTHON,
        label: 'Python',
        code: `import anthropic

client = anthropic.Anthropic(
    api_key="YOUR_ANTHROPIC_API_KEY",
)

message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content[0].text)`,
      },
    ],
    response: [
      {
        language: CodeLanguage.JSON,
        label: 'JSON',
        code: JSON.stringify(
          {
            id: 'msg_013Zva2CMHLNnXjNJJKqJ2EF',
            type: 'message',
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: "Hello! It's nice to meet you. I'm Claude, an AI assistant created by Anthropic. How can I help you today?",
              },
            ],
            model: 'claude-3-opus-20240229',
            stop_reason: 'end_turn',
            stop_sequence: null,
            usage: {
              input_tokens: 10,
              output_tokens: 25,
            },
          },
          null,
          2
        ),
      },
    ],
  },
};

const mistralLargeSchema: ApiDocSchema = {
  meta: {
    title: 'Create Chat Completion with Mistral Large',
    method: HttpMethod.POST,
    endpoint: '/v1/chat/completions',
    description:
      'Creates a model response for the given chat conversation using Mistral Large.',
  },
  headers: [
    {
      name: 'Content-Type',
      type: 'string',
      description: 'Set to `application/json`.',
      required: true,
    },
    {
      name: 'Authorization',
      type: 'string',
      description: 'Bearer token authentication with your Mistral API key.',
      required: true,
    },
  ],
  request: {
    description:
      'The request body contains the chat messages and configuration.',
    type: 'object',
    properties: {
      model: {
        type: 'string',
        description: 'ID of the model to use.',
        required: true,
        example: 'mistral-large-latest',
      },
      messages: {
        type: 'array',
        description: 'The list of messages in the chat.',
        required: true,
        items: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              description: 'The role of the message author.',
              enum: ['system', 'user', 'assistant'],
            },
            content: {
              type: 'string',
              description: 'The contents of the message.',
              example: 'What is the best French cheese?',
            },
          },
        },
      },
      temperature: {
        type: 'number',
        description: 'Controls randomness in the response.',
        default: 0.7,
        example: 0.7,
      },
      top_p: {
        type: 'number',
        description: 'Nucleus sampling parameter.',
        default: 1,
        example: 1,
      },
      max_tokens: {
        type: 'integer',
        description: 'The maximum number of tokens to generate.',
        example: 150,
      },
      stream: {
        type: 'boolean',
        description: 'Whether to stream back partial progress.',
        default: false,
      },
    },
  },
  response: {
    success: {
      statusCode: '200 OK',
      description: 'Successful response containing the chat completion.',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'A unique identifier for the chat completion.',
          },
          object: {
            type: 'string',
            description: 'The object type, which is always "chat.completion".',
          },
          created: {
            type: 'integer',
            description:
              'The Unix timestamp (in seconds) of when the chat completion was created.',
          },
          model: {
            type: 'string',
            description: 'The model used for the chat completion.',
          },
          choices: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                index: {
                  type: 'integer',
                  description:
                    'The index of the choice in the list of choices.',
                },
                message: {
                  type: 'object',
                  properties: {
                    role: {
                      type: 'string',
                      description: 'The role of the author of this message.',
                    },
                    content: {
                      type: 'string',
                      description: 'The contents of the message.',
                    },
                  },
                },
                finish_reason: {
                  type: 'string',
                  description:
                    'The reason the model stopped generating tokens.',
                },
              },
            },
          },
          usage: {
            type: 'object',
            properties: {
              prompt_tokens: {
                type: 'integer',
                description: 'Number of tokens in the prompt.',
              },
              completion_tokens: {
                type: 'integer',
                description: 'Number of tokens in the generated completion.',
              },
              total_tokens: {
                type: 'integer',
                description: 'Total number of tokens used in the request.',
              },
            },
          },
        },
      },
    },
  },
  examples: {
    request: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl https://api.mistral.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_MISTRAL_API_KEY" \\
  -d '{
    "model": "mistral-large-latest",
    "messages": [
      {"role": "user", "content": "What is the best French cheese?"}
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`,
      },
      {
        language: CodeLanguage.PYTHON,
        label: 'Python',
        code: `from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = "YOUR_MISTRAL_API_KEY"
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

chat_response = client.chat(
    model=model,
    messages=messages,
    temperature=0.7,
    max_tokens=150
)

print(chat_response.choices[0].message.content)`,
      },
    ],
    response: [
      {
        language: CodeLanguage.JSON,
        label: 'JSON',
        code: JSON.stringify(
          {
            id: 'cmpl-e5cc70bb28c444948073e77776eb30ef',
            object: 'chat.completion',
            created: 1702256327,
            model: 'mistral-large-latest',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content:
                    "There are many excellent French cheeses, each with its own unique characteristics. Some of the most renowned include Roquefort (a blue cheese), Camembert (soft and creamy), Brie (mild and buttery), Comté (hard aged cheese), and Chèvre (goat cheese). The 'best' really depends on personal taste preferences!",
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 15,
              completion_tokens: 65,
              total_tokens: 80,
            },
          },
          null,
          2
        ),
      },
    ],
  },
};

export const API_DOCS: APIDocument[] = [
  {
    id: 'gemini-flash-text',
    provider: APIProvider.GOOGLE,
    modelName: 'gemini-2.5-flash-preview-04-17',
    serviceName: 'Generative Language API',
    endpoint: '/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent',
    method: HttpMethod.POST,
    summary:
      'Generate text from text-only input. Ideal for quick, general-purpose tasks.',
    description:
      'The Gemini Flash model is optimized for high-volume, fast-response scenarios. It supports text generation, summarization, Q&A, and more with low latency.',
    tags: ['text generation', 'gemini', 'flash', 'multimodal', 'fast'],
    codeExamples: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent \\
-H 'Content-Type: application/json' \\
-d '{
  "contents": [{
    "parts": [{"text": "Write a story about a magic backpack."}]
  }]
}' --header "X-Goog-Api-Key: YOUR_API_KEY"`,
      },
    ],
    lastUpdated: '2024-07-26',
    documentationLink: 'https://ai.google.dev/docs/gemini_api_overview',
    schema: geminiFlashSchema,
  },
  {
    id: 'openai-gpt4o',
    provider: APIProvider.OPENAI,
    modelName: 'gpt-4o',
    serviceName: 'Chat Completions API',
    endpoint: '/v1/chat/completions',
    method: HttpMethod.POST,
    summary:
      "OpenAI's most advanced model, excelling at complex reasoning and creativity.",
    description:
      'GPT-4o ("o" for "omni") is a step towards much more natural human-computer interaction—it accepts as input any combination of text, audio, and image and generates any combination of text, audio, and image outputs.',
    tags: ['text generation', 'chat', 'gpt-4', 'multimodal', 'advanced'],
    codeExamples: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl https://api.openai.com/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_OPENAI_API_KEY" \\
-d '{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
}'`,
      },
    ],
    lastUpdated: '2024-05-13',
    documentationLink: 'https://platform.openai.com/docs/models/gpt-4o',
    schema: openaiGpt4oSchema,
  },
  {
    id: 'anthropic-claude3-opus',
    provider: APIProvider.ANTHROPIC,
    modelName: 'claude-3-opus-20240229',
    serviceName: 'Messages API',
    endpoint: '/v1/messages',
    method: HttpMethod.POST,
    summary: "Anthropic's most powerful model for highly complex tasks.",
    description:
      "Claude 3 Opus is Anthropic's most intelligent model, with best-in-market performance on highly complex tasks. It can navigate open-ended prompts and sight-unseen scenarios with remarkable fluency and human-like understanding.",
    tags: ['text generation', 'claude', 'opus', 'reasoning', 'complex'],
    codeExamples: [
      {
        language: CodeLanguage.PYTHON,
        label: 'Python (anthropic)',
        code: `import anthropic

client = anthropic.Anthropic(api_key="YOUR_ANTHROPIC_API_KEY")
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content[0].text if isinstance(message.content, list) else message.content)`,
      },
    ],
    lastUpdated: '2024-02-29',
    documentationLink:
      'https://docs.anthropic.com/claude/reference/messages_post',
    schema: claudeOpusSchema,
  },
  {
    id: 'mistral-large',
    provider: APIProvider.MISTRAL,
    modelName: 'Mistral Large',
    serviceName: 'Chat API',
    endpoint: '/v1/chat/completions',
    method: HttpMethod.POST,
    summary:
      "Mistral AI's flagship model for complex reasoning and multilingual tasks.",
    description:
      'Mistral Large offers top-tier reasoning capabilities, is multilingual by design (excelling in French, German, Spanish, and Italian, besides English), and supports large context windows. Ideal for complex reasoning, code generation, and RAG.',
    tags: [
      'text generation',
      'mistral',
      'large',
      'multilingual',
      'reasoning',
      'api',
    ],
    codeExamples: [
      {
        language: CodeLanguage.CURL,
        label: 'cURL',
        code: `curl https://api.mistral.ai/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_MISTRAL_API_KEY" \\
-H "Accept: application/json" \\
-d '{
  "model": "mistral-large-latest",
  "messages": [
    {"role": "user", "content": "What is the best French cheese?"}
  ]
}'`,
      },
    ],
    lastUpdated: '2024-07-01',
    documentationLink: 'https://docs.mistral.ai/platform/endpoints/',
    schema: mistralLargeSchema,
  },
];
