---
title: Accounts
section: API reference
lead: Customers and suppliers you do business with.
---

## The account object

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Unique identifier. Read-only. |
| `code` | string | Account code, unique in the division. Max 18 characters. |
| `name` | string | Company or person name. Required. |
| `type` | string | `customer` or `supplier`. Required. |
| `email` | string | Primary e-mail address. |
| `vat_number` | string | VAT or tax number. |
| `currency` | string | Default ISO 4217 currency. |
| `outstanding_amount` | decimal | Open amount. Read-only. |
| `created` | timestamp | Creation time. Read-only. |
| `modified` | timestamp | Last change. Read-only. |

```json
{
  "id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4",
  "code": "10042",
  "name": "Northwind Traders",
  "type": "customer",
  "email": "accounts@northwind.example",
  "vat_number": "NL123456789B01",
  "currency": "EUR",
  "outstanding_amount": 1250.0,
  "created": "2026-05-14T09:21:00Z",
  "modified": "2026-10-02T16:03:44Z"
}
```

## List accounts

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/accounts</div>

Scope: `accounts.read`. Supports all [query options]({{ '/docs/querying/' | relative_url }}).

```bash
curl -G "https://api.oceanledger.example/v1/1001/accounts" \
  --data-urlencode "\$filter=type eq 'customer'" \
  --data-urlencode "\$top=2" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

```json
{
  "data": [
    { "id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4", "code": "10042", "name": "Northwind Traders", "type": "customer" },
    { "id": "1e7d3b94-0a5c-4f12-8e6b-9c24a1d7f305", "code": "10043", "name": "Contoso Bakery", "type": "customer" }
  ],
  "next": "https://api.oceanledger.example/v1/1001/accounts?$skiptoken=eyJwIjoyfQ"
}
```

## Get an account

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/accounts/{id}</div>

Returns the account object, or `404` if it does not exist.

## Create an account

<div class="endpoint"><span class="badge badge-post">POST</span> /v1/{division}/accounts</div>

Scope: `accounts.write`.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `name` | Yes | Account name. |
| `type` | Yes | `customer` or `supplier`. |
| `code` | No | Generated automatically if omitted. |
| `email`, `vat_number`, `currency` | No | See the object above. |

```bash
curl -X POST https://api.oceanledger.example/v1/1001/accounts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Fabrikam Studio", "type": "customer", "currency": "EUR" }'
```

Returns `201 Created` with the new account.

## Update an account

<div class="endpoint"><span class="badge badge-put">PUT</span> /v1/{division}/accounts/{id}</div>

Send only the fields you want to change. Returns `200 OK` with the updated account.

## Delete an account

<div class="endpoint"><span class="badge badge-delete">DELETE</span> /v1/{division}/accounts/{id}</div>

Returns `204 No Content`. An account that has invoices cannot be deleted and returns `409 conflict`.
