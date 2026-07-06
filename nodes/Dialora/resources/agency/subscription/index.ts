import type { INodeProperties } from 'n8n-workflow';
import { unwrapData } from '../../../../common/pagination';
import { subscriptionCreateDescription } from './create';
import { subscriptionGetAllDescription } from './getAll';
import { subscriptionGetDescription } from './get';
import { subscriptionChangePlanDescription } from './changePlan';

const showOnlyForSubscriptions = {
	resource: ['subscription'],
};

export const subscriptionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForSubscriptions },
		options: [
			{
				name: 'Change Plan',
				value: 'changePlan',
				action: 'Change a subscription plan',
				description: 'Move a subscription to a different plan',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v1/subscriptions/{{$parameter.subscriptionId}}/plan',
					},
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a subscription',
				description: 'Subscribe a user to a plan',
				routing: {
					request: { method: 'POST', url: '/api/v1/subscriptions' },
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a subscription',
				description: 'Get a single subscription',
				routing: {
					request: { method: 'GET', url: '=/api/v1/subscriptions/{{$parameter.subscriptionId}}' },
					output: { postReceive: [unwrapData] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many subscriptions',
				description: 'List subscriptions in the tenant',
				routing: {
					request: { method: 'GET', url: '/api/v1/subscriptions' },
					output: { postReceive: [unwrapData] },
				},
			},
		],
		default: 'getAll',
	},
	...subscriptionCreateDescription,
	...subscriptionGetAllDescription,
	...subscriptionGetDescription,
	...subscriptionChangePlanDescription,
];
