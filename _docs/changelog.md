---
title: Changelog
section: Resources
lead: Notable changes to the API, newest first.
---

## 2026-10-01

- **Added** `invoice.paid` webhook topic.
- **Added** `$select` support on `GET /invoices/{id}`.
- **Changed** The default page size for collections is now 60, down from 100.

## 2026-08-12

- **Added** `Idempotency-Key` support on all `POST` endpoints.
- **Added** `X-RateLimit-Daily-Remaining` response header.
- **Fixed** `$filter` with `startswith` no longer ignores case.

## 2026-06-03

- **Added** Items endpoints (`/items`).
- **Deprecated** The `balance` field on accounts. Use `outstanding_amount`. It will be removed in `v2`.

## 2026-04-20

- **Added** Initial public release of the Ocean Ledger API `v1` with accounts and invoices.
