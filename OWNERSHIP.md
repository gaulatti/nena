# Nena ownership and disposition audit

Audit date: 2026-09-07

Default branch and audited commit: `main` at
`bcdafa16602e9aa7f28649f6dcb8d6bd02066a30`.

## Decision

**Disposition: retained live application owner.**

Nena's custom domain, CloudFront distribution, S3 artifact, CodeBuild release
project, and Cognito/Okta client are all present. A clean local build of this
repository's audited `main` produces the same three filenames and identical
bytes as both the S3 origin and public CloudFront responses. No replacement
application repository or alternate live endpoint was found.

`gaulatti/nena` therefore remains the application source of truth.
[`gaulatti/eleni`](https://github.com/gaulatti/eleni) remains the infrastructure
source for the `Nena` delivery stack and the shared `Aitana` identity stack.
Archiving either repository or deleting either stack would orphan a live
surface.

## Ownership and delivery contract

| Concern | Owner and contract |
| --- | --- |
| Application | `gaulatti/nena` `main`; React 18, Vite 5, and Amplify 6 build the static browser application. |
| Infrastructure | `gaulatti/eleni/lib/nena`; CloudFormation stack `Nena` owns the versioned S3 origin, CloudFront distribution, CodeBuild project/role, GitHub source credential, and auto-delete support resources. |
| Identity | `gaulatti/eleni/lib/aitana`; the active Cognito client uses Okta and retains the Nena callback/logout URLs. Nena's source contains the corresponding public client configuration. |
| Release trigger | `NenaBuildProject` watches `gaulatti/nena` pushes to `main`. Its inline buildspec installs dependencies, builds, replaces current S3 objects, and invalidates CloudFront. A main-branch merge is a production release. |
| Secrets | The `Nena` stack owns a Secrets Manager entry used to establish an account-level GitHub personal-access-token credential for CodeBuild. Secret values were not read. A second CodeBuild project exists, so credential deletion or rotation requires a consumer audit. |
| Runtime health | `https://nena.gaulatti.com` must return HTTP 200, serve the reviewed artifact, and send a logged-out clean browser to the `gaulatti - Sign In` surface. Authenticated login/logout remains a separately authorized check. |
| Recovery | Preserve the current source SHA, S3 object versions, CloudFront configuration, Cognito client configuration, and CodeBuild source relationship. Restore prior object versions or rebuild the recorded prior commit, invalidate CloudFront, and repeat the browser checks. |

## Evidence

| Surface | Method | Result |
| --- | --- | --- |
| Git source | Fresh clone plus GitHub repository/branch APIs | Public, unarchived repository; unprotected single branch `main` at `bcdafa16602e9aa7f28649f6dcb8d6bd02066a30`, last changed 2024-06-11. There were no prior pull requests, tags, or releases. |
| GitHub delivery metadata | Actions, runs, deployments, environments, hook, deploy-key, secret-name, variable, artifact, cache, Pages, and ruleset APIs | No Actions workflows/runs, deployments, environments, deploy keys, Actions/Dependabot secrets, Actions variables, artifacts, caches, Pages site, or rulesets exist. Two active CodeBuild webhooks accept push, pull-request, and release events; both target AWS CodeBuild, report no retained deliveries, and have been unchanged since 2024-05-22. |
| GitHub security and packages | Dependabot, code-scanning, secret-scanning, repository source, and package-access checks | Automated security alert surfaces are disabled or have no analysis. `package.json` is private and no publishing configuration exists. The current token lacks `read:packages`, so account-wide GitHub Packages ownership is not authoritative. |
| Public wiki | Repository metadata and managed-updater wiki bootstrap | GitHub reports wiki support enabled, but the derived `gaulatti/nena.wiki.git` remote does not exist or is inaccessible. This in-repository audit is therefore the documentation source. |
| CloudFormation | Active-stack searches across all 17 enabled regions plus exact stack/resource inventory in the configured AWS account | The only matching live stack is `Nena` in `us-east-1`, `UPDATE_COMPLETE`, last updated 2024-05-29. Its live logical resources match Eleni's Nena constructs. Drift has never been checked and no drift operation was started. |
| CodeBuild | Project, source, webhook, artifact, and retained-build APIs | `NenaBuildProject` is configured against `https://github.com/gaulatti/nena.git`, filters pushes to `main`, writes to the Nena S3 bucket, and has no retained build records. The account-level GitHub PAT credential may also support the remaining `temp-zoe` project. |
| S3 and CloudFront | Stack resource inventory, bucket controls/object versions, distribution configuration, and content hashes | The versioned private bucket has three current objects, 36 retained versions, and 33 delete markers; the current artifact was written 2024-06-11. Its enabled/deployed CloudFront distribution uses the bucket as its OAI-protected origin and carries the `nena.gaulatti.com` alias. |
| Artifact provenance | Clean `npm ci`/build followed by SHA-256 comparisons | The clean build, all three current S3 objects, and all three public URL responses use identical filenames and identical bytes. This proves the audited source is the deployed application rather than merely a similarly named repository. |
| DNS and HTTP | Route 53, DNS, CloudFront, and HTTPS checks | Route 53 aliases `nena.gaulatti.com` to the deployed distribution. The custom domain and default distribution hostname both returned HTTP 200. `nena.fifthbell.com` does not resolve and is not an alternate owner. |
| Browser identity boundary | Fresh temporary Chrome profile with no signed-in session | Loading `https://nena.gaulatti.com` executed the deployed application and reached the Cognito-hosted `gaulatti - Sign In` page. No credentials were supplied; login and logout completion remain unverified. |
| Cognito/Okta | Read-only Cognito client and domain metadata | The Aitana domain is active. Its Nena client is OAuth-enabled, supports the Okta provider, and retains localhost plus `https://nena.gaulatti.com` callback/logout URLs. No secret value or user record was read. |
| Portfolio ownership | Exact local searches under `/Users/gaulatti/source` plus authenticated GitHub code searches | Eleni is the only infrastructure source found for the Nena domain, stack, CodeBuild project, and Aitana callbacks. The Nena repository is the only source found for its current identity client and embedded content. No replacement source or consumer was found. |
| Local checks | Node 22 clean install, ESLint, TypeScript, and Vite production build | `npm ci`, `npm run lint`, and `npm run build` pass. The repository has no application test script. The install audit reports 47 existing dependency vulnerabilities: 7 low, 22 moderate, 17 high, and 1 critical. |

Search terms included `gaulatti/nena`, `nena.gaulatti.com`, `NenaBuildProject`,
the public Cognito pool/client identifiers committed in `src/config.ts`, and the
embedded-content identifier committed in `src/pages/index.tsx`.

## Before and after

Before this audit, the README described only an alpha prototype and a generic
Vite template. It did not disclose the live site, infrastructure/identity
owners, automatic deployment trigger, shared credential boundary, health
proof, or recovery path.

After this audit, the repository explicitly retains application ownership,
links its Eleni infrastructure and Aitana identity owners, warns that every
main push can deploy, documents the verified production artifact and browser
boundary, and blocks the next release on
[#2](https://github.com/gaulatti/nena/issues/2).

The application, build configuration, hard-coded public Cognito identifiers,
CloudFormation resources, webhooks, secrets, DNS, and production artifact were
not changed.

## Residual risks and unverified boundaries

- The two active GitHub hooks have no retained delivery evidence, and CodeBuild
  has no retained builds. One hook appears redundant, but neither was mutated.
- The next `main` push can replace the live site. The disposition PR must not be
  merged until #2 supplies explicit deployment authorization, duplicate-hook
  resolution, monitoring, and recovery evidence.
- The CodeBuild GitHub credential is account-level and may be shared with
  `temp-zoe`; its ownership, scope, rotation, and deletion safety are unverified.
- CodeBuild declares Node 20, while local verification used Node 22. The exact
  production build runtime remains unverified until the controlled release.
- Authenticated Okta login, authorization behavior, logout completion, and the
  IdP recovery procedure were not exercised without an approved identity.
- The `Nena` and `Aitana` stacks have no current drift evidence. Do not infer
  deploy safety from successful synthesis or live HTTP health.
- Dependency remediation, GitHub Packages visibility, and a missing automated
  application test suite are outside this ownership-only change.
- Only the configured AWS account and its 17 enabled regions were inspected;
  unnamed hosts or resources in another account remain possible.

## Safety record

No merge, deployment, CodeBuild invocation, CDK synth/diff/deploy, drift
operation, webhook change, secret read/rotation, DNS change, bucket write,
CloudFront invalidation, identity mutation, or production change was performed.
