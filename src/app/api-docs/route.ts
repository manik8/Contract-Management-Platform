import { NextResponse } from 'next/server'

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Contract Management Platform API',
    version: '1.0.0',
    description: 'API documentation for the Contract Management Platform',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/blueprints': {
      get: {
        summary: 'List all blueprints',
        tags: ['Blueprints'],
        responses: {
          '200': {
            description: 'List of blueprints',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Blueprint' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new blueprint',
        tags: ['Blueprints'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBlueprint' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Blueprint created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Blueprint' },
              },
            },
          },
          '400': {
            description: 'Validation error',
          },
        },
      },
    },
    '/blueprints/{id}': {
      get: {
        summary: 'Get blueprint by ID',
        tags: ['Blueprints'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Blueprint details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Blueprint' },
              },
            },
          },
          '404': {
            description: 'Blueprint not found',
          },
        },
      },
      delete: {
        summary: 'Delete a blueprint',
        tags: ['Blueprints'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Blueprint deleted successfully',
          },
          '404': {
            description: 'Blueprint not found',
          },
        },
      },
    },
    '/contracts': {
      get: {
        summary: 'List all contracts',
        tags: ['Contracts'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['CREATED', 'APPROVED', 'SENT', 'SIGNED', 'LOCKED', 'REVOKED'],
            },
            description: 'Filter by status',
          },
        ],
        responses: {
          '200': {
            description: 'List of contracts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Contract' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new contract',
        tags: ['Contracts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateContract' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Contract created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contract' },
              },
            },
          },
          '400': {
            description: 'Validation error',
          },
          '404': {
            description: 'Blueprint not found',
          },
        },
      },
    },
    '/contracts/{id}': {
      get: {
        summary: 'Get contract by ID',
        tags: ['Contracts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Contract details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contract' },
              },
            },
          },
          '404': {
            description: 'Contract not found',
          },
        },
      },
      patch: {
        summary: 'Update contract fields',
        tags: ['Contracts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fields: {
                    type: 'object',
                    additionalProperties: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Contract updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contract' },
              },
            },
          },
          '400': {
            description: 'Cannot update locked contract',
          },
          '404': {
            description: 'Contract not found',
          },
        },
      },
    },
    '/contracts/{id}/transition': {
      post: {
        summary: 'Transition contract status',
        tags: ['Contracts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['CREATED', 'APPROVED', 'SENT', 'SIGNED', 'LOCKED', 'REVOKED'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Status transitioned successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contract' },
              },
            },
          },
          '400': {
            description: 'Invalid transition',
          },
          '404': {
            description: 'Contract not found',
          },
        },
      },
    },
    '/seed': {
      post: {
        summary: 'Seed database with sample data',
        tags: ['Utilities'],
        responses: {
          '200': {
            description: 'Database seeded successfully',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Blueprint: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          fields: {
            type: 'array',
            items: { $ref: '#/components/schemas/BlueprintField' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      BlueprintField: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: {
            type: 'string',
            enum: ['TEXT', 'DATE', 'SIGNATURE', 'CHECKBOX'],
          },
          label: { type: 'string' },
          positionX: { type: 'number' },
          positionY: { type: 'number' },
          required: { type: 'boolean' },
        },
      },
      CreateBlueprint: {
        type: 'object',
        required: ['name', 'fields'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          fields: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateBlueprintField' },
          },
        },
      },
      CreateBlueprintField: {
        type: 'object',
        required: ['type', 'label'],
        properties: {
          type: {
            type: 'string',
            enum: ['TEXT', 'DATE', 'SIGNATURE', 'CHECKBOX'],
          },
          label: { type: 'string' },
          positionX: { type: 'number', default: 0 },
          positionY: { type: 'number', default: 0 },
          required: { type: 'boolean', default: false },
        },
      },
      Contract: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          blueprintId: { type: 'string' },
          blueprint: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
          },
          status: {
            type: 'string',
            enum: ['CREATED', 'APPROVED', 'SENT', 'SIGNED', 'LOCKED', 'REVOKED'],
          },
          fields: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContractField' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ContractField: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fieldId: { type: 'string' },
          value: { type: 'string', nullable: true },
        },
      },
      CreateContract: {
        type: 'object',
        required: ['name', 'blueprintId'],
        properties: {
          name: { type: 'string' },
          blueprintId: { type: 'string' },
          fields: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(swaggerDocument)
}
