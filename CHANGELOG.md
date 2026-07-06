# Changelog

## 0.5.0

Added webhook-driven nodes for the call lifecycle.

### Added

- **Dialora Trigger** (`dialoraTrigger`) — starts a workflow when Dialora posts a call event. Static
  webhook URL, pasted into the agent's Webhook tool configuration (works with today's per-agent generic
  webhook). Optional "Only Completed Calls" filter.
- **Dialora Call & Wait** (`dialoraCallAndWait`) — programmatic node that starts an outbound call via
  `POST /api/v1/calls`, passes n8n's per-execution resume URL as `completion_webhook_url`, and suspends
  the execution (`putExecutionToWait`) until the completion webhook resumes it with the call result.
  Optional max-wait timeout; `continueOnFail` supported on the call-start request. Requires the Phase 2
  `calls:write` API — contract spec at `backend/docs/public-api-calls-webhook-proposal.md`.

## 0.4.0

Consolidated back into a single **Dialora** node (`dialora`), following the mature-integration pattern:
one node, one credential, resources grouped by API scope.

### Changed

- The `Dialora Agency` node was merged into the `Dialora` node; its User / Plan / Subscription resources
  now live under `nodes/Dialora/resources/agency/`. The Resource dropdown stays flat — when Dialora's
  account-level APIs ship, an `account/` scope folder (contacts, calls, campaigns) is spread into
  `resources/index.ts` with no breaking changes.
- `package.json` → `n8n.nodes` back to a single entry.

### Fixed

- **Return All pagination sent `page=NaN`** — n8n's declarative generic pagination only exposes
  `$request` / `$response` (no `$pageCount`), so `{{ $pageCount + 1 }}` evaluated to NaN and the API
  returned `422 validation_failed`. The next page is now derived from the response's own pagination echo:
  `{{ ($response?.body?.pagination?.page ?? 0) + 1 }}`.

### Removed

- The provisional `Call` preview resource (it targeted endpoints that don't exist yet). Account-scope
  resources will be added when the APIs are public.

## 0.3.0

Split the package into two nodes that share one credential.

### Changed

- The single `Dialora` node was reorganized: its live resources (Users, Plans, Subscriptions) moved into a
  new **`Dialora Agency`** node (`dialoraPartner`) — the agency/agency surface of `/api/v1/*`.
- Shared helpers hoisted to a node-agnostic `nodes/common/` (`pagination.ts`, `request-defaults.ts`) so
  every node reuses the same pagination, envelope-unwrap, and request defaults.

### Added

- **`Dialora`** node (`dialora`) — the flagship core product API, scaffolded as a Phase 2 preview with a
  provisional read-only **Call** resource (Get Many, Get). Operations require the `calls:read` scope and
  will error until the endpoints ship; the node carries an in-UI notice saying so.
- Both nodes use the one shared **Dialora API** credential (research confirmed the public API uses a single
  `dlr_…` key format across scopes — there is no separate account/agency key).

### Notes

- Adding a future node = new `nodes/<Name>/` folder reusing `credentials/DialoraApi` + `nodes/common/*`,
  plus one entry in `package.json` → `n8n.nodes`.

## 0.2.0

Realigned the node to the real Dialora agency API (`/api/v1/*`).

### Changed

- **Credential** renamed `Dialora Dialora API` → `Dialora API` (`dialoraApi`). Auth switched from the
  `x-api-key` header to `Authorization: Bearer <dlr_…>`. Added a **Base URL** field (default
  `https://api.dialora.ai`; set `https://dev.api.dialora.ai` for development). Credential test now hits
  `GET /api/v1/plans?limit=1`.
- **Node** renamed `Dialora Dialora` → `Dialora` (`dialora`).

### Added

- **User** resource: Create, Get Many (status/search/sort filters + full pagination), Delete.
- **Plan** resource: Get Many (active/provider/sort filters + pagination), Get.
- **Subscription** resource: Create, Get Many (user/plan/status filters + pagination), Get, Change Plan.
- Page-based pagination driven by the API's `pagination.has_more` flag, response-envelope unwrapping
  (`{ data }` → items), and optional `Idempotency-Key` on create/change operations.
