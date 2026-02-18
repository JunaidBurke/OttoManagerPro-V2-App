# Tests

Automated tests live here.

- Unit tests
- Integration tests
- End-to-end tests

## Run Locally

From the repository root:

```bash
npm test
```

### Tenant Safety Baseline

`tests/tenant-safety-baseline.test.ts` verifies baseline tenant protections:

- org-scoped reads never return records from another `organizationId`
- location-scoped reads never return records from another `locationId`
