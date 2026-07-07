/* eslint-disable @n8n/community-nodes/node-usable-as-tool -- trigger nodes cannot be AI tools, and the type forbids `usableAsTool: false` */
import {
	NodeConnectionTypes,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

export class DialoraTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dialora Trigger',
		name: 'dialoraTrigger',
		icon: { light: 'file:dialora.svg', dark: 'file:dialora.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: 'Call Completed',
		description: 'Starts a workflow when Dialora sends a call event webhook',
		defaults: {
			name: 'Dialora Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					"Copy this node's webhook URL into your Dialora agent's <b>Webhook</b> tool configuration (Agent → Tools → Generic Webhook), or pass it as <code>webhook_url</code> when creating a call via <code>POST /api/v1/calls</code>. Dialora will POST the call result here when a call ends, starting this workflow with the transcript, summary, and extractions.",
				name: 'setupNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Only Completed Calls',
				name: 'onlyCompleted',
				type: 'boolean',
				default: false,
				description:
					'Whether to trigger only for completed calls (agent-webhook payloads with status "completed", or API events of type "call.completed"), ignoring other outcomes',
			},
		],
	};

	// Dialora has no webhook subscription API — the user pastes this node's URL into the
	// agent's webhook tool config manually, so there is nothing to register or clean up.
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

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const onlyCompleted = this.getNodeParameter('onlyCompleted', false) as boolean;

		// The agent's Generic Webhook tool posts a flat payload with a top-level `status`;
		// the public API's webhook_url delivery posts an event envelope with a `type`.
		const isCompleted = body.status === 'completed' || body.type === 'call.completed';

		if (onlyCompleted && !isCompleted) {
			// Acknowledge the delivery but do not start the workflow
			return { noWebhookResponse: false };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
