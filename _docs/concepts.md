---
title: Core concepts
section: Introduction
lead: The building blocks you meet in every request.
---

## Base URL and versioning

All requests use HTTPS and the base URL:

```
https://api.oceanledger.example/v1
```

The major version is part of the path. Backwards-compatible changes, such as new fields or new endpoints, are added to the current version without notice, so your client must ignore unknown fields. Breaking changes ship in a new major version and are announced in the [changelog]({{ '/docs/changelog/' | relative_url }}) at least 12 months ahead.

## Divisions

A **division** is a single company administration. Data is never shared between divisions. Most endpoints include the division code in the path:

```
/v1/{division}/invoices
```

A user can authorize your app for several divisions. Use `GET /v1/me` to find the current one and `GET /v1/me/divisions` to list all of them.

## Identifiers

Resources are identified by a UUID in the `id` field. Treat identifiers as opaque strings. Human-readable codes, such as an account `code` or an invoice `number`, are separate fields and may be changed by users.

## Request and response format

- Send `Content-Type: application/json` for `POST` and `PUT` bodies.
- Dates use ISO 8601 (`2026-10-08`); timestamps are UTC (`2026-10-08T13:42:10Z`).
- Monetary amounts are decimal numbers with a separate three-letter ISO 4217 `currency` field.
- Responses wrap results in a `data` envelope.

```json
{
  "data": {
    "id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4",
    "code": "10042",
    "name": "Northwind Traders"
  }
}
```

## HTTP methods

| Method | Purpose |
|--------|---------|
| `GET` | Read one resource or a collection. Never changes data. |
| `POST` | Create a resource. |
| `PUT` | Update a resource. Only the fields you send are changed. |
| `DELETE` | Delete a resource, where deleting is allowed. |

## Idempotency

To safely retry `POST` requests after a timeout, send an `Idempotency-Key` header with a unique value, for example a UUID. Repeating the request with the same key within 24 hours returns the original response instead of creating a duplicate.

```http
POST /v1/1001/invoices HTTP/1.1
Idempotency-Key: 0c9e5d52-8f3b-4a1c-9d5e-61b7f2a4c8d0
```
