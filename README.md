# @dialora/n8n-nodes-dialora

This is an n8n community node. It lets you use [Dialora](https://dialora.ai), an AI voice-agent platform,
in your n8n workflows.

The package ships three nodes sharing one credential:

- **Dialora** — the main action node for Dialora's public API (`/api/v1/*`). Resources are grouped by API
  scope — the **Agency** scope (tenant users, plans, subscriptions) is live today; **Account** resources
  (contacts, calls, campaigns) will appear as new entries in the same Resource dropdown when those APIs
  ship, with no breaking changes.
- **Dialora Trigger** — starts a workflow when Dialora posts a call-completion webhook. Works today: copy
  the node's webhook URL into your agent's Webhook tool configuration.
- **Dialora Call & Wait** — starts an outbound call and suspends the workflow until the call completes;
  the completion payload (transcript, summary, extractions, analytics) becomes the node's output.
  Requires Dialora's Phase 2 `POST /api/v1/calls` endpoint (`calls:write` scope) — contract in
  `backend/docs/public-api-calls-webhook-proposal.md`.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow
automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Adding resources](#adding-resources)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n
community nodes documentation.

## Operations

### Agency scope (live)

**User**

- **Create** — provision a user (`email`, `name`, `password`, optional `phone`).
- **Get Many** — list users, with `status` / `search` / sort filters and full pagination.
- **Delete** — soft-delete a user by ID.

**Plan**

- **Get Many** — list catalog plans, with `active` / `provider` / sort filters and pagination.
- **Get** — fetch a single plan by ID.

**Subscription**

- **Create** — subscribe a user to a plan (`user_id`, `plan_id`).
- **Get Many** — list subscriptions, with `user_id` / `plan_id` / `status` filters and pagination.
- **Get** — fetch a single subscription by ID.
- **Change Plan** — move a subscription to a different plan (server-side proration).

Create and Change Plan operations accept an optional **Idempotency Key** to make retries safe within a
24-hour window.

### Account scope (planned)

Contacts, calls, and campaigns will be added as new resources in the same node when Dialora's account-level
APIs become public.

### Dialora Trigger

Fires with the call result payload (`transcript`, `summary`, `extractions`, `analytics`, `status`,
numbers, direction) whenever your Dialora agent finishes a call. Setup: activate the workflow, copy the
production webhook URL from the trigger node, and paste it into the agent's **Webhook** tool
configuration in Dialora. An **Only Completed Calls** toggle skips non-completed statuses.

### Dialora Call & Wait

Starts an outbound call (`agent`, `to number`, optional `from number` / `context` / `metadata`), passing
n8n's per-execution resume URL as the completion callback, then pauses the execution — no polling, no
resources consumed while waiting. When Dialora posts the completion webhook, the workflow resumes with
the call result as this node's output. An optional **Max Wait (Minutes)** resumes the workflow with its
input data if no completion arrives in time. Requires an API key with the `calls:write` scope (Phase 2).

## Credentials

You need a Dialora API key. Mint one from the Agency dashboard under **API Keys**; the key looks like
`dlr_live_…` (production) or `dlr_test_…` (non-production) and is granted scopes such as `users:read`,
`users:write`, `plans:read`, `subscriptions:read`, `subscriptions:write`. The operation you run must be
covered by the key's scopes, or the API returns `403 permission_denied`.

In n8n, create a **Dialora API** credential and paste the key. Set **Base URL** to
`https://api.dialora.ai` for production or `https://dev.api.dialora.ai` for development. The credential is
sent as `Authorization: Bearer <key>` and tested against `GET /api/v1/plans`.

Dialora's public API uses a single `dlr_…` key format across all scopes — future account-level resources
will use this same credential; a key's granted scopes determine which operations it can run.

## Compatibility

Built against the n8n community node API v1 (`n8n-workflow` peer dependency). Tested with current n8n.

## Usage

- **Pagination:** enable **Return All** on any Get Many operation to walk every page automatically, or
  leave it off and set **Limit** to cap results.
- **Filters:** optional filters and sorting live under the **Filters** section of each Get Many operation.
- The node unwraps Dialora's `{ "data": … }` response envelope, so downstream nodes receive the resource
  objects directly. Rate-limit (`429`) and validation (`422`) responses surface as node errors.

## Adding resources

The code mirrors the API's scope structure while the n8n Resource dropdown stays flat:

- `credentials/DialoraApi.credentials.ts` — the one shared credential.
- `nodes/common/` — shared helpers: `pagination.ts` (`paginationFields`, `unwrapData`) and
  `request-defaults.ts` (`DIALORA_REQUEST_DEFAULTS`).
- `nodes/Dialora/resources/<scope>/` — one folder per API scope (`agency/` today). Each scope's
  `index.ts` exports `<scope>ResourceOptions` + `<scope>Description`; each `<scope>/<resource>/` holds an
  `index.ts` of operations plus per-operation field files.
- `nodes/Dialora/resources/index.ts` — composes all scopes into the node's Resource dropdown.

To add a resource to an existing scope, create `resources/<scope>/<resource>/` and register it in that
scope's `index.ts`. To add a new scope (e.g. `account/`), create the folder with its own aggregator and
spread it in `resources/index.ts` — the node, credential, and package wiring need no changes.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Dialora public API reference](https://www.dialora.ai/docs/api/)

## Version history

- **0.5.0** — Added **Dialora Trigger** (call-completion webhook trigger) and **Dialora Call & Wait**
  (start a call, suspend until the completion webhook resumes the workflow).
- **0.4.0** — Consolidated into a single **Dialora** node with resources grouped by API scope
  (`agency/` now; `account/` later).
- **0.3.0** — Split into two nodes sharing one credential; hoisted shared helpers to `nodes/common/`.
- **0.2.0** — Realigned to the real agency API (`/api/v1/*`): Bearer auth + Base URL credential, and
  User / Plan / Subscription resources. Replaced the boilerplate `User.get` / `Company` operations.
- **0.1.0** — Initial scaffold.
