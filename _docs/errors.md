---
title: Errors
section: Guides
lead: The API uses standard HTTP status codes and a consistent error body.
---

## Error format

```json
{
  "error": {
    "code": "validation_failed",
    "message": "One or more fields are invalid.",
    "request_id": "req_8d2f4a1b9c",
    "details": [
      { "field": "lines[0].quantity", "message": "Must be greater than 0." }
    ]
  }
}
```

Include the `request_id` when you contact support. It is also returned in the `X-Request-Id` header.

## Status codes

| Status | Code | Meaning |
|--------|------|---------|
| `400` | `bad_request` | The request could not be parsed. |
| `401` | `unauthorized` | Missing, expired or invalid access token. Refresh the token. |
| `403` | `forbidden` | The token lacks the required scope, or the user may not access the division. |
| `404` | `not_found` | The resource does not exist in this division. |
| `409` | `conflict` | The resource changed or violates a uniqueness rule. |
| `422` | `validation_failed` | The body is well-formed but a field is invalid. |
| `429` | `rate_limited` | See [rate limits]({{ '/docs/rate-limits/' | relative_url }}). |
| `500` | `internal_error` | Something went wrong on our side. Retry later. |
| `503` | `unavailable` | Temporary maintenance or overload. Retry with backoff. |

## What to retry

| Retry? | Statuses |
|--------|----------|
| Yes, with backoff | `429`, `500`, `503`, network timeouts |
| Yes, once after refreshing the token | `401` |
| No, fix the request first | `400`, `403`, `404`, `409`, `422` |

> Combine retries of `POST` requests with an [`Idempotency-Key`]({{ '/docs/concepts/' | relative_url }}#idempotency) so a retry never creates a duplicate.
{: .tip}
