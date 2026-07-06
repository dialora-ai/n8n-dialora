import type { INodeProperties } from 'n8n-workflow';
import { unwrapData } from '../../../../common/pagination';
import { userCreateDescription } from './create';
import { userGetAllDescription } from './getAll';
import { userDeleteDescription } from './delete';

const showOnlyForUsers = {
	resource: ['user'],
};

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForUsers },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a user',
				description: 'Provision a new user in the tenant',
				routing: {
					request: { method: 'POST', url: '/api/v1/users' },
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a user',
				description: 'Soft-delete a user in the tenant',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/users/{{$parameter.userId}}' },
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many users',
				description: 'List users in the tenant',
				routing: {
					request: { method: 'GET', url: '/api/v1/users' },
					output: { postReceive: [unwrapData] },
				},
			},
		],
		default: 'getAll',
	},
	...userCreateDescription,
	...userGetAllDescription,
	...userDeleteDescription,
];
