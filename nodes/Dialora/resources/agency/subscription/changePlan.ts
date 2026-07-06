import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubscriptionChangePlan = {
	operation: ['changePlan'],
	resource: ['subscription'],
};

export const subscriptionChangePlanDescription: INodeProperties[] = [
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForSubscriptionChangePlan },
		description: 'ID of the subscription to change',
	},
	{
		displayName: 'Plan ID',
		name: 'plan_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForSubscriptionChangePlan },
		description:
			'Target plan ID in the catalog. Must be active with the same provider and currency as the current plan. Proration is handled server-side.',
		routing: { send: { type: 'body', property: 'plan_id' } },
	},
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		default: '',
		displayOptions: { show: showOnlyForSubscriptionChangePlan },
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
