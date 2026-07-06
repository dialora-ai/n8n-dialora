import type { INodeProperties } from 'n8n-workflow';
import { paginationFields } from '../../../../common/pagination';

const showOnlyForUserGetAll = {
	operation: ['getAll'],
	resource: ['user'],
};

export const userGetAllDescription: INodeProperties[] = [
	...paginationFields(showOnlyForUserGetAll),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showOnlyForUserGetAll },
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				description:
					'Filter by user status. Omit to return users in any status (inspect each item’s status for pending).',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Blocked', value: 'blocked' },
				],
				routing: { send: { type: 'query', property: 'status' } },
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Case-insensitive substring search across user name and email',
				routing: { send: { type: 'query', property: 'search' } },
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
