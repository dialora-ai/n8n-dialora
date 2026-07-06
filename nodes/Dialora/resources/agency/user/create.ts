import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserCreate = {
	operation: ['create'],
	resource: ['user'],
};

export const userCreateDescription: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForUserCreate },
		description: 'Email address for the new user',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForUserCreate },
		description: 'Display name for the new user',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: { show: showOnlyForUserCreate },
		description: 'Initial password for the new user (minimum 8 characters)',
		routing: { send: { type: 'body', property: 'password' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showOnlyForUserCreate },
		options: [
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				placeholder: '+15551234567',
				description: 'Optional phone number in E.164 format',
				routing: { send: { type: 'body', property: 'phone' } },
			},
		],
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForUserCreate },
		description:
			'Optional client-supplied key (≤255 ASCII chars) to make retries safe within a 24-hour window. Replaying with the same key and identical body returns the original response.',
		routing: {
			request: {
				headers: {
					'Idempotency-Key': '={{ $value || undefined }}',
				},
			},
		},
	},
];
