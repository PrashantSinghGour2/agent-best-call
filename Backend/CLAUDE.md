# CLAUDE.md

Project-level notes for Claude Code / Copilot / other agent tooling working in this repo.

## AWS

- **Account:** `710894194408` (`aws-ent-ptu-dev-sparkathon`, aka Sparkathon)
- **Region:** `us-east-1`
- **Profile:** `Spark_users@710894194408` (federated SSO role `Spark_users`, written by MSEntraAuthAWSCLI)
- Use this profile for all AWS CLI / SDK / CDK operations in this project.
- The Node app reads `AWS_PROFILE` and `AWS_REGION` from `.env`, and the AWS SDK v3 default credential provider chain loads the shared credentials automatically.

### If credentials are expired

Sessions expire after 1 hour. When AWS calls fail with `ExpiredToken` / `The security token included in the request is expired`, ask the user to re-run:

```
C:\MS_Entra_Auth\MSEntraAuthAWSCLI.exe i --all-accounts --default-session-duration 3600
```

Nothing else needs to change — the profile is refreshed in place.

## Bedrock

- Default model: `anthropic.claude-3-sonnet-20240229-v1:0` (on-demand in `us-east-1`).
- The Sparkathon `Spark_users` role has an **explicit deny** on Bedrock invocations that would route to `us-east-2`, so `us.` cross-region inference profiles (Claude 3.5+, Sonnet 4.6, etc.) will fail with `AccessDeniedException`. Stick to on-demand models available in this account: `anthropic.claude-3-sonnet-20240229-v1:0` or `anthropic.claude-3-haiku-20240307-v1:0`.
- Override with `BEDROCK_MODEL_ID` in `.env`.
- Ensure the model is enabled in the account: Bedrock console → **Model access** → request/enable Anthropic Claude models in `us-east-1`.

## What NOT to do

- Do NOT add `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` to `.env` or code. Credentials come from the SSO profile only.
- Do NOT switch the region without checking Bedrock model availability first.
- Do NOT use `aws-azure-login` (fails NICE device compliance).
