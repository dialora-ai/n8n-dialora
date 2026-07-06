import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

/**
 * Return the standard `Return All` + `Limit` fields for a Dialora list operation.
 *
 * The Dialora agency API is page-based (`?page=&limit=`) and reports whether more
 * rows remain via `pagination.has_more`. When `Return All` is on we drive n8n's
 * generic pagination off that flag, walking pages with the max page size (100).
 *
 * @param show displayOptions.show condition scoping the fields to one resource + operation
 */
export function paginationFields(show: IDisplayOptions['show']): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: { paginate: '={{ $value }}' },
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							continue: '={{ $response?.body?.pagination?.has_more === true }}',
							request: {
								qs: {
									// Declarative pagination only exposes $request/$response (no
									// $pageCount), so derive the next page from the API's own
									// pagination echo; on the first request $response is empty → 1.
									page: '={{ ($response?.body?.pagination?.page ?? 0) + 1 }}',
									limit: 100,
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...show, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			routing: {
				send: { type: 'query', property: 'limit' },
				output: { maxResults: '={{ $value }}' },
			},
			description: 'Max number of results to return',
		},
	];
}

/** Post-receive action that unwraps the Dialora `{ data: … }` response envelope. */
export const unwrapData = {
	type: 'rootProperty' as const,
	properties: { property: 'data' },
};
