---
title: Invoices
section: API reference
lead: Sales invoices with one or more lines.
---

## The invoice object

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Unique identifier. Read-only. |
| `number` | integer | Invoice number, assigned on creation. Read-only. |
| `account_id` | uuid | The customer. Required. |
| `invoice_date` | date | Date of the invoice. Required. |
| `due_date` | date | Payment due date. Defaults to the account's payment terms. |
| `currency` | string | ISO 4217 currency. Required. |
| `status` | string | `draft`, `open`, `paid` or `cancelled`. |
| `lines` | array | Invoice lines, see below. At least one. |
| `subtotal` | decimal | Total excluding VAT. Read-only. |
| `vat_total` | decimal | Total VAT. Read-only. |
| `total` | decimal | Total including VAT. Read-only. |
| `modified` | timestamp | Last change. Read-only. |

### Invoice line

| Field | Type | Description |
|-------|------|-------------|
| `item_id` | uuid | The item. Required. |
| `description` | string | Overrides the item description. |
| `quantity` | decimal | Number of units. Must be greater than 0. |
| `unit_price` | decimal | Overrides the item price. |
| `vat_rate` | decimal | Overrides the item VAT rate. |

```json
{
  "id": "9a3b7f10-2c4d-4e86-b1a5-6d08c7e3f294",
  "number": 2026001,
  "account_id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4",
  "invoice_date": "2026-10-08",
  "due_date": "2026-11-07",
  "currency": "EUR",
  "status": "open",
  "lines": [
    { "item_id": "5d9b7c10-1a2e-4f60-b3c8-7e41d0a96f12", "description": "Widget, large", "quantity": 3, "unit_price": 49.5, "vat_rate": 21.0 }
  ],
  "subtotal": 148.5,
  "vat_total": 31.19,
  "total": 179.69,
  "modified": "2026-10-08T13:42:10Z"
}
```

## List invoices

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/invoices</div>

Scope: `invoices.read`.

<div class="code-tabs" markdown="1">

```bash
curl -G "https://api.oceanledger.example/v1/1001/invoices" \
  --data-urlencode "\$filter=status eq 'open' and due_date lt 2026-10-08" \
  --data-urlencode "\$select=id,number,due_date,total" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

```javascript
const params = new URLSearchParams({
  $filter: "status eq 'open' and due_date lt 2026-10-08",
  $select: "id,number,due_date,total"
});
const res = await fetch(`https://api.oceanledger.example/v1/1001/invoices?${params}`, {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

```python
res = requests.get(
    "https://api.oceanledger.example/v1/1001/invoices",
    params={
        "$filter": "status eq 'open' and due_date lt 2026-10-08",
        "$select": "id,number,due_date,total",
    },
    headers={"Authorization": f"Bearer {access_token}"},
)
```

</div>

```json
{
  "data": [
    { "id": "9a3b7f10-2c4d-4e86-b1a5-6d08c7e3f294", "number": 2026001, "due_date": "2026-10-01", "total": 179.69 }
  ]
}
```

## Get an invoice

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/invoices/{id}</div>

Returns the invoice including its lines.

## Create an invoice

<div class="endpoint"><span class="badge badge-post">POST</span> /v1/{division}/invoices</div>

Scope: `invoices.write`. Send an [`Idempotency-Key`]({{ '/docs/concepts/' | relative_url }}#idempotency) header to make retries safe.

```bash
curl -X POST https://api.oceanledger.example/v1/1001/invoices \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 0c9e5d52-8f3b-4a1c-9d5e-61b7f2a4c8d0" \
  -d '{
    "account_id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4",
    "invoice_date": "2026-10-08",
    "currency": "EUR",
    "lines": [
      { "item_id": "5d9b7c10-1a2e-4f60-b3c8-7e41d0a96f12", "quantity": 3 }
    ]
  }'
```

Returns `201 Created` with the invoice. Invalid input returns `422`:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "One or more fields are invalid.",
    "request_id": "req_8d2f4a1b9c",
    "details": [{ "field": "lines[0].quantity", "message": "Must be greater than 0." }]
  }
}
```

## Update an invoice

<div class="endpoint"><span class="badge badge-put">PUT</span> /v1/{division}/invoices/{id}</div>

Only invoices with status `draft` can have their lines changed. Open invoices accept changes to `due_date` only.

## Cancel an invoice

<div class="endpoint"><span class="badge badge-delete">DELETE</span> /v1/{division}/invoices/{id}</div>

Draft invoices are deleted. Open invoices are set to `cancelled`. Paid invoices return `409 conflict`.
