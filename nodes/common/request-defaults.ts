import type { INodeTypeDescription } from 'n8n-workflow';

/**
 * Shared `requestDefaults` for every Dialora node. Base URL comes from the shared
 * `dialoraApi` credential; all requests send/accept JSON.
 */
export const DIALORA_REQUEST_DEFAULTS: INodeTypeDescription['requestDefaults'] = {
	baseURL: '={{$credentials.baseUrl}}',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
};
