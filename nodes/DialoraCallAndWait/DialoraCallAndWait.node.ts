/* eslint-disable @n8n/community-nodes/node-usable-as-tool -- AI tool invocations cannot suspend an execution (putExecutionToWait), and the type forbids `usableAsTool: false` */
import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	WAIT_INDEFINITELY,
	type IDataObject,
	type JsonObject,
	type IExecuteFunctions,
	type IHookFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

export class DialoraCallAndWait implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dialora Call & Wait',
		name: 'dialoraCallAndWait',
		icon: { light: 'file:dialora.svg', dark: 'file:dialora.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '=Call via agent {{$parameter["agentId"]}}',
		description: 'Start an outbound Dialora call and pause the workflow until the call completes',
		defaults: {
			name: 'Dialora Call & Wait',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'dialoraApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '',
				restartWebhook: true,
			},
		],
		properties: [
			{
				displayName:
					"Starts a call via <code>POST /api/v1/calls</code> and suspends this workflow. Dialora resumes it by posting the call result (transcript, summary, extractions) to a per-execution callback URL. Requires an API key with the <code>calls:write</code> scope — this endpoint is part of Dialora's Phase 2 API.",
				name: 'phasePreviewNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the Dialora agent that should make the call',
			},
			{
				displayName: 'To Number',
				name: 'toNumber',
				type: 'string',
				required: true,
				default: '',
				placeholder: '+15551234567',
				description: 'Phone number to call, in E.164 format',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Context',
						name: 'context',
						type: 'json',
						default: '{}',
						description: "JSON object passed to the agent as call context (e.g. the callee's name)",
					},
					{
						displayName: 'From Number',
						name: 'fromNumber',
						type: 'string',
						default: '',
						placeholder: '+15550001111',
						description:
							"E.164 number owned by your tenant to call from. Leave empty to use the agent's assigned number.",
					},
					{
						displayName: 'Max Wait (Minutes)',
						name: 'maxWaitMinutes',
						type: 'number',
						typeOptions: { minValue: 0 },
						default: 0,
						description:
							'Resume the workflow after this many minutes even if no completion webhook arrived (the node then outputs its input data unchanged). 0 waits indefinitely.',
					},
					{
						displayName: 'Metadata',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description: 'JSON object echoed back verbatim in the completion payload',
					},
				],
			},
		],
	};

	// The completion callback is a per-execution n8n resume URL passed in the create-call
	// request — there is no webhook to register or clean up on Dialora's side.
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const agentId = this.getNodeParameter('agentId', 0) as string;
		const toNumber = this.getNodeParameter('toNumber', 0) as string;
		const options = this.getNodeParameter('options', 0, {}) as {
			context?: string;
			fromNumber?: string;
			maxWaitMinutes?: number;
			metadata?: string;
		};

		const resumeUrl = this.evaluateExpression('{{ $execution.resumeUrl }}', 0) as string;

		const parseJsonOption = (name: 'context' | 'metadata'): IDataObject | undefined => {
			const raw = options[name];

			if (!raw || raw === '{}') return undefined;

			try {
				return JSON.parse(raw) as IDataObject;
			} catch {
				throw new NodeOperationError(this.getNode(), `Option "${name}" is not valid JSON`);
			}
		};

		const credentials = await this.getCredentials('dialoraApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		const body: IDataObject = {
			agent_id: agentId,
			to_number: toNumber,
			completion_webhook_url: resumeUrl,
		};

		const fromNumber = options.fromNumber?.trim();

		if (fromNumber) body.from_number = fromNumber;

		const context = parseJsonOption('context');

		if (context) body.context = context;

		const metadata = parseJsonOption('metadata');

		if (metadata) body.metadata = metadata;

		try {
			await this.helpers.httpRequestWithAuthentication.call(this, 'dialoraApi', {
				method: 'POST',
				url: `${baseUrl}/api/v1/calls`,
				body,
				json: true,
			});
		} catch (error) {
			if (this.continueOnFail()) {
				// The call never started — emit the error instead of suspending the workflow
				return [[{ json: { error: (error as Error).message }, pairedItem: { item: 0 } }]];
			}

			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		const maxWaitMinutes = options.maxWaitMinutes ?? 0;
		const waitTill =
			maxWaitMinutes > 0 ? new Date(Date.now() + maxWaitMinutes * 60_000) : WAIT_INDEFINITELY;

		await this.putExecutionToWait(waitTill);

		// Returned only when the wait resumes by timeout — on webhook resume,
		// webhook() below provides the output items instead.
		return [this.getInputData()];
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
