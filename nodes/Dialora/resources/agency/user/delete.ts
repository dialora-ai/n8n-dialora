import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUserDelete = {
	operation: ['delete'],
	resource: ['user'],
};

export const userDeleteDescription: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnlyForUserDelete },
		description: 'ID of the user to soft-delete',
	},
];
