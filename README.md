# Nena

> **Disposition: retained live application owner.** This repository is the
> source currently served at [`nena.gaulatti.com`](https://nena.gaulatti.com).
> Its deployment is live but operationally unsafe: a push to `main` can replace
> the production S3 contents through AWS CodeBuild. Do not merge or push to
> `main` without the release gate in [#2](https://github.com/gaulatti/nena/issues/2).

Nena is a small React/Vite experiment protected by the shared Aitana
Cognito/Okta login. The deployed artifact is an exact byte-for-byte match for a
clean build of the current default-branch source.

## Ownership

- **Application source:** this repository, `gaulatti/nena`.
- **Infrastructure source:**
  [`gaulatti/eleni/lib/nena`](https://github.com/gaulatti/eleni/tree/main/lib/nena)
  owns the `Nena` CloudFormation stack, S3 bucket, CloudFront distribution, and
  CodeBuild project.
- **Identity source:**
  [`gaulatti/eleni/lib/aitana`](https://github.com/gaulatti/eleni/tree/main/lib/aitana)
  owns the Cognito user pool, Okta provider, and Nena callback/logout URLs.
- **Administrative owner:** `gaulatti`, including AWS, GitHub webhook, CodeBuild,
  and Secrets Manager access.
- **Canonical local application checkout:** `/Users/gaulatti/source/gaulatti/nena`
  with origin `git@github.com:gaulatti/nena.git`.

Read [OWNERSHIP.md](OWNERSHIP.md) for the dated control-plane inventory,
current health proof, recovery contract, and unverified boundaries.

## Local verification

```bash
npm ci
npm run lint
npm run build
```

The build produces three static files in `dist/`. There is no application test
suite or backend in this repository.

## Delivery contract

The current AWS CodeBuild project watches pushes to `main`, runs `npm install`
and `npm run build`, removes the current S3 objects, syncs `dist/`, and
invalidates the CloudFront index. Two active GitHub webhooks currently point to
CodeBuild even though only one project is declared. Both hooks accepted this
audit's feature-branch and pull-request events, while CodeBuild started no build
because its filter excludes non-`main` refs. A merge must therefore be treated
as a production deployment—not as a documentation-only operation.

Before a release:

1. Review the exact commit and complete [#2](https://github.com/gaulatti/nena/issues/2),
   including the duplicate-hook and shared-source-credential checks.
2. Record the current S3 object versions, CloudFront configuration, and known
   good source commit.
3. Obtain an approved release window and explicit authorization for the
   merge-triggered deployment.
4. Observe one CodeBuild execution and correlate the deployed artifact to the
   merged SHA.
5. Verify HTTPS, the clean-browser identity redirect, authenticated login and
   logout, and rollback readiness.

Infrastructure changes belong in `gaulatti/eleni`, not here. They require a
stack-specific `cdk diff Nena`, reviewed CloudFormation/resource evidence, and
an approved `npx cdk deploy Nena`; do not use Eleni's historical generic deploy
command.

## Health and rollback

A logged-out clean browser must load `https://nena.gaulatti.com` and reach the
`gaulatti - Sign In` page through the active Aitana Cognito/Okta flow. Login and
logout completion require an approved test identity and remain part of #2.

The S3 bucket is versioned. Roll back by restoring the recorded prior object
versions or rebuilding the recorded prior source commit, then invalidate the
CloudFront index and repeat the browser checks. Never delete the `Nena` or
`Aitana` stacks, their source credential, bucket versions, distribution, DNS,
or identity configuration while this live ownership contract remains.
