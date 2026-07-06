import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPlanGet = {
	operation: ['get'],
	resource: ['plan'],
};

export const planGetDescription: INodeProperties[] = [
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForPlanGet },
		description: 'ID of the plan to retrieve',
	},
];
