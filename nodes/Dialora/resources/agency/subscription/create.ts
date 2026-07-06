import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubscriptionCreate = {
	operation: ['create'],
	resource: ['subscription'],
};

export const subscriptionCreateDescription: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'user_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForSubscriptionCreate },
		description: 'ID of the user to subscribe',
		routing: { send: { type: 'body', property: 'user_id' } },
	},
	{
		displayName: 'Plan ID',
		name: 'plan_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForSubscriptionCreate },
		description: 'ID of the plan to subscribe the user to (must be an active plan in the catalog)',
		routing: { send: { type: 'body', property: 'plan_id' } },
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForSubscriptionCreate },
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
