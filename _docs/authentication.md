---
title: Authentication
section: Guides
lead: Ocean Ledger uses OAuth 2.0 so users can grant your app access without sharing their password.
---

## Overview

The API supports the **OAuth 2.0 authorization code flow**. Your app redirects the user to a consent screen, receives a short-lived code, and exchanges it for an access token and a refresh token.

| Token | Lifetime | Use |
|-------|----------|-----|
| Authorization code | 2 minutes, single use | Exchanged for tokens. |
| Access token | 10 minutes | Sent as a bearer token with every API call. |
| Refresh token | 30 days, rotated on every use | Obtain a new access token. |

## Endpoints

| Purpose | URL |
|---------|-----|
| Authorize | `https://auth.oceanledger.example/oauth2/authorize` |
| Token | `https://auth.oceanledger.example/oauth2/token` |
| Revoke | `https://auth.oceanledger.example/oauth2/revoke` |

## Step 1: redirect the user

Send the user's browser to the authorize endpoint:

```http
GET /oauth2/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https%3A%2F%2Flocalhost%3A5001%2Fcallback
  &scope=accounts.read%20invoices.write
  &state=af0ifjsldkj
```

Always send a random `state` value and verify it when the user returns. This protects against cross-site request forgery.

After the user approves, they are sent back to your redirect URI:

```
https://localhost:5001/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj
```

## Step 2: exchange the code

```bash
curl -X POST https://auth.oceanledger.example/oauth2/token \
  -d grant_type=authorization_code \
  -d code=SplxlOBeZQQYbYS6WxSbIA \
  -d redirect_uri=https://localhost:5001/callback \
  -d client_id=$CLIENT_ID \
  -d client_secret=$CLIENT_SECRET
```

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.demo",
  "token_type": "Bearer",
  "expires_in": 600,
  "refresh_token": "rt_7f3b9a1c0d2e4f58",
  "scope": "accounts.read invoices.write"
}
```

## Step 3: call the API

Send the access token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.demo
```

## Refreshing tokens

Request a new access token before the current one expires:

```bash
curl -X POST https://auth.oceanledger.example/oauth2/token \
  -d grant_type=refresh_token \
  -d refresh_token=rt_7f3b9a1c0d2e4f58 \
  -d client_id=$CLIENT_ID \
  -d client_secret=$CLIENT_SECRET
```

The response contains a **new** refresh token. The previous one is invalidated immediately, so always store the latest one.

> Refresh requests for the same user must not run in parallel. If two requests use the same refresh token, the second fails with `invalid_grant` and the user may have to authorize again. Serialize refreshes, for example with a lock per user.
{: .warning}

## Scopes

| Scope | Grants |
|-------|--------|
| `accounts.read` | Read accounts. |
| `accounts.write` | Create and update accounts. |
| `items.read` | Read items. |
| `items.write` | Create and update items. |
| `invoices.read` | Read invoices. |
| `invoices.write` | Create and update invoices. |
| `webhooks.manage` | Create and delete webhook subscriptions. |

Request only the scopes you need. Users see them on the consent screen.

## Storing credentials securely

- Keep the client secret on the server and inject it at deploy time from a secret store. Do not hardcode it.
- Encrypt refresh tokens at rest.
- Revoke tokens when a user disconnects your app.

## Errors

| Error | Meaning |
|-------|---------|
| `invalid_request` | A required parameter is missing or malformed. |
| `invalid_client` | Unknown client ID or wrong secret. |
| `invalid_grant` | The code or refresh token is expired, used or revoked. |
| `invalid_scope` | A requested scope is unknown or not enabled for your app. |
