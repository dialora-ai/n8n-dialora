import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';
import { userDescription } from './user';
import { planDescription } from './plan';
import { subscriptionDescription } from './subscription';

/**
 * The "Agency" scope of the Dialora public API (`/api/v1/*`, tagged `Agency / …` in the
 * backend): tenant user, plan, and subscription management.
 *
 * To add a resource to this scope: create `agency/<resource>/`, then register it here by
 * appending to `agencyResourceOptions` and `agencyDescription`.
 */
export const agencyResourceOptions: INodePropertyOptions[] = [
	{ name: 'Agency / User', value: 'user' },
	{ name: 'Agency / Plan', value: 'plan' },
	{ name: 'Agency / Subscription', value: 'subscription' },
];

export const agencyDescription: INodeProperties[] = [
	...userDescription,
	...planDescription,
	...subscriptionDescription,
];
