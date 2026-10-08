---
layout: default
title: Home
body_class: page-home
---
<section class="hero">
  <div class="hero-inner">
    <p class="eyebrow">Developer documentation · Demo</p>
    <h1>Build integrations on the Ocean Ledger API</h1>
    <p class="sub">Connect your apps to accounts, items and invoices with a simple REST API, secure OAuth 2.0 access and real-time webhooks.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/docs/getting-started/' | relative_url }}">Get started</a>
      <a class="btn btn-outline" href="{{ '/docs/reference/invoices/' | relative_url }}">Browse the API reference</a>
    </div>
  </div>
</section>

<section class="section">
  <h2>Start with the essentials</h2>
  <p class="section-sub">Everything you need to make your first call and go live.</p>
  <div class="cards">
    <a class="card" href="{{ '/docs/getting-started/' | relative_url }}">
      <div class="icon">🚀</div>
      <h3>Getting started</h3>
      <p>Register an app, get a token and create your first invoice in minutes.</p>
    </a>
    <a class="card" href="{{ '/docs/authentication/' | relative_url }}">
      <div class="icon">🔐</div>
      <h3>Authentication</h3>
      <p>Implement the OAuth 2.0 authorization code flow and refresh tokens safely.</p>
    </a>
    <a class="card" href="{{ '/docs/querying/' | relative_url }}">
      <div class="icon">🔎</div>
      <h3>Querying data</h3>
      <p>Filter, sort, select fields and page through large result sets.</p>
    </a>
    <a class="card" href="{{ '/docs/webhooks/' | relative_url }}">
      <div class="icon">🔔</div>
      <h3>Webhooks</h3>
      <p>Get notified when data changes and verify every payload signature.</p>
    </a>
    <a class="card" href="{{ '/docs/rate-limits/' | relative_url }}">
      <div class="icon">⏱️</div>
      <h3>Rate limits</h3>
      <p>Understand limits and design integrations that back off gracefully.</p>
    </a>
    <a class="card" href="{{ '/docs/reference/invoices/' | relative_url }}">
      <div class="icon">📘</div>
      <h3>API reference</h3>
      <p>Endpoints, parameters and example responses for every resource.</p>
    </a>
  </div>
</section>

<section class="band">
  <div class="section">
    <h2>Your first request</h2>
    <p class="section-sub">Once you have an access token, listing your accounts is a single call.</p>
    <div class="code-tabs" markdown="1">

```bash
curl 'https://api.oceanledger.example/v1/1001/accounts?$top=2' \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json"
```

```javascript
const res = await fetch("https://api.oceanledger.example/v1/1001/accounts?$top=2", {
  headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
});
const { data } = await res.json();
```

```python
import requests

res = requests.get(
    "https://api.oceanledger.example/v1/1001/accounts",
    params={"$top": 2},
    headers={"Authorization": f"Bearer {access_token}"},
)
data = res.json()["data"]
```

</div>
  </div>
</section>

<section class="section">
  <h2>Go live in four steps</h2>
  <ol class="steps">
    <li><strong>Register your app</strong>Create an app in the developer console to receive a client ID and secret.</li>
    <li><strong>Authorize a company</strong>Send users through the OAuth 2.0 consent screen.</li>
    <li><strong>Call the API</strong>Use the access token to read and write data for the user's division.</li>
    <li><strong>Subscribe to webhooks</strong>Stay in sync without polling.</li>
  </ol>
</section>
