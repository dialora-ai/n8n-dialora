import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';
import { agencyResourceOptions, agencyDescription } from './agency';

/**
 * All resources of the Dialora node, grouped by API scope. The n8n resource dropdown stays
 * flat — the grouping is organizational, mirroring how the public API grows (Agency scope
 * today; Account scope — contacts, calls, campaigns — when those APIs ship).
 *
 * To add a scope: create `resources/<scope>/` with its own `index.ts` exporting
 * `<scope>ResourceOptions` + `<scope>Description`, then spread both below. Same credential
 * for everything — Dialora uses one `dlr_…` key format across all scopes.
 */
export const resourceOptions: INodePropertyOptions[] = [...agencyResourceOptions];

export const dialoraDescription: INodeProperties[] = [...agencyDescription];
