---
title: Querying data
section: Guides
lead: Filter, sort, select and page through collections with OData-style query options.
---

All collection endpoints accept the query options below. Option names start with `$`, so quote or escape them in a shell.

| Option | Description | Example |
|--------|-------------|---------|
| `$filter` | Return only matching records. | `$filter=status eq 'open'` |
| `$select` | Return only the listed fields. | `$select=id,number,total` |
| `$orderby` | Sort the results. | `$orderby=invoice_date desc` |
| `$top` | Page size, between 1 and 60. Default 60. | `$top=25` |
| `$skiptoken` | Continuation token for the next page. | `$skiptoken=eyJwIjoyfQ` |

## Filtering

Operators:

| Operator | Meaning |
|----------|---------|
| `eq`, `ne` | Equal, not equal |
| `gt`, `ge`, `lt`, `le` | Greater than, greater or equal, less than, less or equal |
| `and`, `or` | Combine conditions |

Functions: `startswith(field, 'text')`, `contains(field, 'text')`.

```bash
curl -G https://api.oceanledger.example/v1/1001/invoices \
  --data-urlencode "\$filter=status eq 'open' and total gt 1000" \
  --data-urlencode "\$orderby=due_date" \
  --data-urlencode "\$select=id,number,due_date,total" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Values:

- Strings use single quotes: `'Northwind'`. Escape a quote by doubling it: `'O''Brien'`.
- Dates are written without quotes: `invoice_date ge 2026-01-01`.
- UUIDs are written without quotes.

## Selecting fields

Only request the fields you need. Smaller responses are faster and count the same toward your [rate limit]({{ '/docs/rate-limits/' | relative_url }}).

```
GET /v1/1001/accounts?$select=id,code,name
```

## Pagination

Collections return at most 60 records per page. When more records exist, the response includes a `next` URL with a `$skiptoken`.

```json
{
  "data": [ { "id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4", "code": "10042" } ],
  "next": "https://api.oceanledger.example/v1/1001/accounts?$skiptoken=eyJwIjoyfQ"
}
```

Follow `next` until it is absent. Do not build or alter the token yourself, and keep the other query options identical between pages.

```javascript
async function fetchAll(url, token) {
  const records = [];
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const body = await res.json();
    records.push(...body.data);
    url = body.next;
  }
  return records;
}
```

```python
def fetch_all(url, token):
    records = []
    while url:
        body = requests.get(url, headers={"Authorization": f"Bearer {token}"}).json()
        records.extend(body["data"])
        url = body.get("next")
    return records
```

> Do not download everything on a schedule just to find changes. Use the `modified` field with `$filter=modified gt 2026-10-08T00:00:00Z`, or subscribe to [webhooks]({{ '/docs/webhooks/' | relative_url }}).
{: .tip}
