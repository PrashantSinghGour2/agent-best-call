import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { SIGNAL_KEYS } from './scoringService.js';

// Region + credentials come from process.env / ~/.aws/credentials.
// AWS_PROFILE=Spark_users@710894194408 (set in .env) tells the SDK's default
// credential provider chain to load the federated SSO profile written by
// MSEntraAuthAWSCLI. If the token has expired, re-run:
//   C:\MS_Entra_Auth\MSEntraAuthAWSCLI.exe i --all-accounts --default-session-duration 3600
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

const SYSTEM_PROMPT = `You are a contact-center QA analyst evaluating call transcripts for a "Best Call of the Week" program.

You will receive an array of call objects (multiple agents, multiple calls each). Score EVERY call on six signals, each 0-10 (integers or one decimal place):

1. sentiment_recovery       - Did the customer start negative/neutral and end positive because the AGENT actively turned it around? An easy call scores low here.
2. first_contact_resolution - Was the issue clearly resolved on this call without transfer/escalation?
3. customer_effort          - Low effort = high score. Penalize repeated explanations, long holds, transfers, unclear next steps.
4. no_alerts_fired          - Absence of red flags: no rudeness, interruptions, dead air, escalations, compliance risks.
5. empathy_language         - Did the agent use acknowledgement, ownership language, and calming phrases at appropriate moments?
6. aht_within_range         - Was the call handled efficiently for its complexity? Very short trivial calls should NOT get a 10; very long or padded calls score low.

Also produce contactSummary: 2-3 sentence factual summary of what happened on that call.

Return ONLY valid minified JSON with this exact shape, no prose, no code fences:
{"results":[{"caseId":"...","scores":{"sentiment_recovery":N,"first_contact_resolution":N,"customer_effort":N,"no_alerts_fired":N,"empathy_language":N,"aht_within_range":N},"contactSummary":"..."}, ...]}

The results array MUST contain one entry per input call, and each entry MUST include the exact caseId from the input.`;

/**
 * Score ALL calls in a single Bedrock request.
 * Returns Map<caseId, { scores, contactSummary }>.
 */
export async function scoreAllCallsWithLlm(calls) {
  // Send a compact payload so the model can key its response by caseId.
  const compact = calls.map((c) => ({
    caseId: c.caseId,
    agentId: c.agentId,
    agentName: c.agentName,
    queue: c.queue,
    ahtSeconds: c.ahtSeconds,
    transcript: c.transcript,
  }));

  const userMsg = `Score the following ${compact.length} calls:\n\n${JSON.stringify(compact)}`;

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMsg }],
    max_tokens: 4096,
    temperature: 0.1,
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body,
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(await response.body.transformToString());
  const text = (responseBody.content?.[0]?.text || '').trim();

  const parsed = safeParseJson(text);
  if (!parsed || !Array.isArray(parsed.results)) {
    throw new Error(`LLM did not return a valid results array. Raw text: ${text}`);
  }

  const map = new Map();
  for (const entry of parsed.results) {
    if (!entry?.caseId) continue;
    const scores = {};
    for (const key of SIGNAL_KEYS) {
      const val = Number(entry.scores?.[key]);
      scores[key] = Number.isFinite(val) ? Math.max(0, Math.min(10, val)) : 0;
    }
    map.set(entry.caseId, {
      scores,
      contactSummary: String(entry.contactSummary || '').trim(),
    });
  }
  return map;
}

/** Extract the first JSON object from a string (handles minor stray prose). */
function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
