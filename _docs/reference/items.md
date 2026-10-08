---
title: Items
section: API reference
lead: Products and services you can put on an invoice line.
---

## The item object

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Unique identifier. Read-only. |
| `code` | string | Item code, unique in the division. Required. |
| `description` | string | Display name. Required. |
| `unit` | string | Unit of measure, for example `pcs` or `hour`. |
| `sales_price` | decimal | Default price per unit, excluding VAT. |
| `currency` | string | ISO 4217 currency of the price. |
| `vat_rate` | decimal | VAT percentage, for example `21.0`. |
| `is_active` | boolean | Inactive items cannot be used on new invoices. |
| `modified` | timestamp | Last change. Read-only. |

```json
{
  "id": "5d9b7c10-1a2e-4f60-b3c8-7e41d0a96f12",
  "code": "WIDGET-L",
  "description": "Widget, large",
  "unit": "pcs",
  "sales_price": 49.5,
  "currency": "EUR",
  "vat_rate": 21.0,
  "is_active": true,
  "modified": "2026-09-11T08:15:30Z"
}
```

## List items

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/items</div>

Scope: `items.read`.

```bash
curl -G "https://api.oceanledger.example/v1/1001/items" \
  --data-urlencode "\$filter=is_active eq true and startswith(code,'WIDGET')" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Get an item

<div class="endpoint"><span class="badge badge-get">GET</span> /v1/{division}/items/{id}</div>

## Create an item

<div class="endpoint"><span class="badge badge-post">POST</span> /v1/{division}/items</div>

Scope: `items.write`.

```bash
curl -X POST https://api.oceanledger.example/v1/1001/items \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "code": "WIDGET-S", "description": "Widget, small", "unit": "pcs", "sales_price": 19.95, "currency": "EUR", "vat_rate": 21.0 }'
```

Returns `201 Created`. A duplicate `code` returns `409 conflict`.

## Update an item

<div class="endpoint"><span class="badge badge-put">PUT</span> /v1/{division}/items/{id}</div>

Changing the price does not affect existing invoices.

## Delete an item

<div class="endpoint"><span class="badge badge-delete">DELETE</span> /v1/{division}/items/{id}</div>

Items used on invoices cannot be deleted. Set `is_active` to `false` instead.
