import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { DIALORA_REQUEST_DEFAULTS } from '../common/request-defaults';
import { resourceOptions, dialoraDescription } from './resources';

export class Dialora implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dialora',
		name: 'dialora',
		icon: { light: 'file:dialora.svg', dark: 'file:dialora.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Dialora API',
		defaults: {
			name: 'Dialora',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'dialoraApi', required: true }],
		requestDefaults: DIALORA_REQUEST_DEFAULTS,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [...resourceOptions],
				default: 'user',
			},
			...dialoraDescription,
		],
	};
}
