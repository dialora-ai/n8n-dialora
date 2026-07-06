import type { INodeProperties } from 'n8n-workflow';
import { unwrapData } from '../../../../common/pagination';
import { planGetAllDescription } from './getAll';
import { planGetDescription } from './get';

const showOnlyForPlans = {
	resource: ['plan'],
};

export const planDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPlans },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a plan',
				description: 'Get a single subscription plan',
				routing: {
					request: { method: 'GET', url: '=/api/v1/plans/{{$parameter.planId}}' },
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many plans',
				description: 'List subscription plans in the tenant catalog',
				routing: {
					request: { method: 'GET', url: '/api/v1/plans' },
					output: { postReceive: [unwrapData] },
				},
			},
		],
		default: 'getAll',
	},
	...planGetAllDescription,
	...planGetDescription,
];
