---
title: Webhooks
section: Guides
lead: Receive an HTTP call when data changes instead of polling the API.
---

## How it works

1. You create a subscription for a topic, with an HTTPS callback URL.
2. When a matching event occurs, we send a `POST` request to your URL.
3. Your endpoint verifies the signature and replies with a `2xx` status within 5 seconds.

## Topics

| Topic | Triggered when |
|-------|----------------|
| `account.created` | An account is created. |
| `account.updated` | An account is changed. |
| `invoice.created` | An invoice is created. |
| `invoice.updated` | An invoice is changed. |
| `invoice.paid` | An invoice is fully paid. |
| `item.updated` | An item is changed. |

## Create a subscription

Requires the `webhooks.manage` scope.

```bash
curl -X POST https://api.oceanledger.example/v1/1001/webhooks \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "invoice.paid",
    "callback_url": "https://integrations.example.com/hooks/ledger"
  }'
```

The response includes a `secret`. It is shown only once, so store it securely.

```json
{
  "data": {
    "id": "e0b1c9a2-33d4-4c58-a0f6-2d7c91b4e8a3",
    "topic": "invoice.paid",
    "callback_url": "https://integrations.example.com/hooks/ledger",
    "secret": "whsec_demo_4f9a1c7e",
    "status": "active"
  }
}
```

## Payload

The payload is deliberately small. Fetch the resource if you need the details.

```json
{
  "id": "evt_31c7a9",
  "topic": "invoice.paid",
  "division": 1001,
  "occurred_at": "2026-10-08T13:42:10Z",
  "resource": {
    "id": "9a3b7f10-2c4d-4e86-b1a5-6d08c7e3f294",
    "url": "https://api.oceanledger.example/v1/1001/invoices/9a3b7f10-2c4d-4e86-b1a5-6d08c7e3f294"
  }
}
```

## Verify the signature

Each request has an `X-Signature` header containing the hex-encoded HMAC-SHA256 of the raw request body, using your subscription secret. Reject requests that do not match.

```javascript
import crypto from "node:crypto";

function isValid(rawBody, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

```python
import hmac, hashlib

def is_valid(raw_body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

## Delivery and retries

- Events are delivered **at least once**. Use the event `id` to ignore duplicates.
- Order is not guaranteed. Compare `occurred_at` or fetch the current state.
- A failed delivery is retried after 1 minute, 5 minutes, 30 minutes, 2 hours and 12 hours.
- After repeated failures the subscription status becomes `suspended`.
