import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DialoraApi implements ICredentialType {
	name = 'dialoraApi';

	displayName = 'Dialora API';

	icon: Icon = { light: 'file:dialora.svg', dark: 'file:dialora.dark.svg' };

	documentationUrl = 'https://github.com/dialora-ai/n8n-nodes#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Your Dialora agency API key. Mint one from the Agency dashboard (API Keys). Looks like <code>dlr_live_…</code> in production or <code>dlr_test_…</code> in non-production.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.dialora.ai',
			description:
				'Base URL of the Dialora API. Use <code>https://api.dialora.ai</code> for production or <code>https://dev.api.dialora.ai</code> for development.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/plans',
			qs: { limit: 1 },
		},
	};
}
