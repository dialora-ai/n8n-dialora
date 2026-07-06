import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubscriptionGet = {
	operation: ['get'],
	resource: ['subscription'],
};

export const subscriptionGetDescription: INodeProperties[] = [
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForSubscriptionGet },
		description: 'ID of the subscription to retrieve',
	},
];
