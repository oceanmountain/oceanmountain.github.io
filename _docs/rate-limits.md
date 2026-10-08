---
title: Rate limits
section: Guides
lead: Limits keep the API fast and fair for everyone. Learn how to read them and how to back off.
---

## Limits

Limits apply per app, per division.

| Limit | Value | Resets |
|-------|-------|--------|
| Requests per minute | 60 | Every minute |
| Requests per day | 5,000 | At midnight UTC |

Exceeding a limit returns `429 Too Many Requests`.

## Response headers

Every response includes your remaining allowance:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Requests allowed in the current minute. |
| `X-RateLimit-Remaining` | Requests left in the current minute. |
| `X-RateLimit-Reset` | UTC epoch seconds when the minute window resets. |
| `X-RateLimit-Daily-Limit` | Requests allowed per day. |
| `X-RateLimit-Daily-Remaining` | Requests left today. |
| `Retry-After` | Seconds to wait. Only present on `429`. |

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 23
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1791463350
```

## Handling `429`

Wait for `Retry-After` seconds, then retry. For repeated failures, use exponential backoff with jitter.

```javascript
async function request(url, options, attempt = 0) {
  const res = await fetch(url, options);
  if (res.status !== 429 || attempt >= 5) return res;
  const wait = Number(res.headers.get("Retry-After")) || 2 ** attempt;
  await new Promise(r => setTimeout(r, (wait + Math.random()) * 1000));
  return request(url, options, attempt + 1);
}
```

## Reduce your usage

- Use [`$select` and `$filter`]({{ '/docs/querying/' | relative_url }}) to fetch only what you need.
- Replace polling with [webhooks]({{ '/docs/webhooks/' | relative_url }}).
- Cache data that rarely changes, such as items.
- Spread scheduled jobs over time instead of starting them all at once.
