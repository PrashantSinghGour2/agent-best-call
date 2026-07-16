import express from 'express';
import { dummyCalls } from '../dummyData/calls.js';
import { scoreAllCallsWithLlm } from '../services/bedrockService.js';
import {
  computeWeightedScore,
  isEligibleForBestCall,
  pickBestCallPerAgent,
} from '../services/scoringService.js';

const router = express.Router();

/**
 * POST /api/agent/best-calls
 *
 * Body (optional):
 *   { "calls": [ { agentId, agentName, caseId, callDate, queue, ahtSeconds, transcript }, ... ] }
 *
 * If no body is provided, the built-in dummyCalls dataset is used.
 *
 * All calls are sent to Bedrock in a SINGLE request. The LLM returns
 * per-call scores keyed by caseId; the server computes weighted scores,
 * eligibility, and best-per-agent locally.
 */
router.post('/best-calls', async (req, res) => {
  const inputCalls = Array.isArray(req.body?.calls) && req.body.calls.length > 0
    ? req.body.calls
    : dummyCalls;

  try {
    const scoreMap = await scoreAllCallsWithLlm(inputCalls);

    const scored = inputCalls.map((call) => {
      const llm = scoreMap.get(call.caseId);
      if (!llm) {
        return {
          contact_id: call.caseId,
          agent_id: call.agentId,
          agent_name: call.agentName,
          call_date: call.callDate,
          queue: call.queue,
          error: 'LLM did not return a result for this caseId',
          scores: null,
          weighted_score: 0,
          eligible_for_best_call: false,
        };
      }
      return {
        contact_id: call.caseId,
        agent_id: call.agentId,
        agent_name: call.agentName,
        call_date: call.callDate,
        queue: call.queue,
        scores: llm.scores,
        weighted_score: computeWeightedScore(llm.scores),
        contactSummary: llm.contactSummary,
        eligible_for_best_call: isEligibleForBestCall(llm.scores),
      };
    });

    const scoredOk = scored.filter((c) => c.scores);
    const bestPerAgent = pickBestCallPerAgent(scoredOk);

    res.json({
      week_summary: {
        total_calls_analyzed: scored.length,
        successfully_scored: scoredOk.length,
        failed: scored.length - scoredOk.length,
        total_agents: new Set(scored.map((c) => c.agent_id)).size,
        eligible_calls: scoredOk.filter((c) => c.eligible_for_best_call).length,
      },
      best_calls_per_agent: bestPerAgent,
      failures: scored
        .filter((c) => c.error)
        .map((c) => ({ contact_id: c.contact_id, agent_id: c.agent_id, error: c.error })),
    });
  } catch (err) {
    console.error('[best-calls] fatal:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
