import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../../../common/pagination';

const showOnlyForSubscriptionGetAll = {
	operation: ['getAll'],
	resource: ['subscription'],
};

export const subscriptionGetAllDescription: INodeProperties[] = [
	...paginationFields(showOnlyForSubscriptionGetAll),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForSubscriptionGetAll },
		options: [
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				default: '',
				description: 'Filter to subscriptions belonging to this user',
				routing: { send: { type: 'query', property: 'user_id' } },
			},
			{
				displayName: 'Plan ID',
				name: 'plan_id',
				type: 'string',
				default: '',
				description: 'Filter to subscriptions on this plan',
				routing: { send: { type: 'query', property: 'plan_id' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				description: 'Filter by lifecycle state',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Past Due', value: 'past_due' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Trialing', value: 'trialing' },
					{ name: 'Unpaid', value: 'unpaid' },
				],
				routing: { send: { type: 'query', property: 'status' } },
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				default: 'desc',
				description: 'Sort by creation time in the chosen order',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				routing: { send: { type: 'query', property: 'sort_order' } },
			},
		],
	},
];
