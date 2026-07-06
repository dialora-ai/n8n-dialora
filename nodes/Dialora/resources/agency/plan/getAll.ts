import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../../../common/pagination';

const showOnlyForPlanGetAll = {
	operation: ['getAll'],
	resource: ['plan'],
};

export const planGetAllDescription: INodeProperties[] = [
	...paginationFields(showOnlyForPlanGetAll),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForPlanGetAll },
		options: [
			{
				displayName: 'Active Only',
				name: 'active',
				type: 'boolean',
				default: true,
				description:
					'Whether to return only plans currently offered to new subscribers. Set to false to include archived/inactive plans.',
				routing: { send: { type: 'query', property: 'active' } },
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				default: 'stripe',
				description: 'Filter by billing provider',
				options: [
					{ name: 'Stripe', value: 'stripe' },
					{ name: 'Agency', value: 'agency' },
				],
				routing: { send: { type: 'query', property: 'provider' } },
			},
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				default: 'created_at',
				description: 'Field to sort by',
				options: [
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Name', value: 'name' },
				],
				routing: { send: { type: 'query', property: 'sort_by' } },
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				default: 'desc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				routing: { send: { type: 'query', property: 'sort_order' } },
			},
		],
	},
];
