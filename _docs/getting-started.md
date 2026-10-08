---
title: Getting started
section: Introduction
lead: Register an app, get an access token and make your first API call in a few minutes.
---

The Ocean Ledger API is a REST API that returns JSON. It lets your application read and write accounting data such as accounts, items and invoices for the companies that authorize it.

## Before you begin

You need:

- A developer account for the developer console (demo: no real sign-up required).
- A company ("division") to test against. Every developer account comes with a sandbox division with sample data.
- A tool to send HTTP requests, such as cURL or Postman.

## 1. Register an app

In the developer console, choose **Create app** and fill in:

| Field | Description |
|-------|-------------|
| App name | Shown to users on the consent screen. |
| Redirect URI | Where users are sent after authorizing, for example `https://localhost:5001/callback`. Must use HTTPS except for `localhost`. |
| Scopes | The permissions your app needs, such as `accounts.read` or `invoices.write`. |

After saving, you receive a **client ID** and a **client secret**.

> Treat the client secret like a password. Keep it on your server, never in browser or mobile code, and never commit it to source control. Load it from a secret store such as a key vault at deploy time.
{: .danger}

## 2. Get an access token

Send the user to the authorization endpoint and exchange the returned code for a token. The [Authentication guide]({{ '/docs/authentication/' | relative_url }}) describes the complete flow. In the sandbox you can also generate a short-lived token directly in the console.

## 3. Find your division

Almost all resources are scoped to a division. Ask the API which division belongs to the current token:

```bash
curl https://api.oceanledger.example/v1/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

```json
{
  "data": {
    "user_id": "7a1f0c52-5b8e-4d0a-9b1e-2f6d8c33a9b1",
    "name": "Sam Rivera",
    "current_division": 1001
  }
}
```

## 4. Make your first call

List the first five accounts of your division:

```bash
curl "https://api.oceanledger.example/v1/1001/accounts?\$top=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json"
```

A successful call returns `200 OK` with a `data` array and, if more records exist, a `next` link.

## 5. Create an invoice

```bash
curl -X POST https://api.oceanledger.example/v1/1001/invoices \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "c3f2a8d1-6e0b-4a57-8d34-0b9c1a7e52f4",
    "invoice_date": "2026-10-08",
    "currency": "EUR",
    "lines": [
      { "item_id": "5d9b7c10-1a2e-4f60-b3c8-7e41d0a96f12", "quantity": 3, "unit_price": 49.5 }
    ]
  }'
```

## Next steps

- Learn the [core concepts]({{ '/docs/concepts/' | relative_url }}) such as divisions and identifiers.
- Read how to [query data]({{ '/docs/querying/' | relative_url }}) efficiently.
- Subscribe to [webhooks]({{ '/docs/webhooks/' | relative_url }}) instead of polling.
