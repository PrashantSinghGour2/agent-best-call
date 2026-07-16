// Weighting + eligibility rules for "Best Call of the Week".
// Weights come from the feature brief:
//   sentiment_recovery       30%
//   first_contact_resolution 25%
//   customer_effort          20%
//   no_alerts_fired          10%
//   empathy_language         10%
//   aht_within_range          5%
// All individual signal scores are on a 0-10 scale, so the weighted score
// is also 0-10.

export const SIGNAL_WEIGHTS = Object.freeze({
  sentiment_recovery: 0.30,
  first_contact_resolution: 0.25,
  customer_effort: 0.20,
  no_alerts_fired: 0.10,
  empathy_language: 0.10,
  aht_within_range: 0.05,
});

export const SIGNAL_KEYS = Object.freeze(Object.keys(SIGNAL_WEIGHTS));

// A call must score above this threshold on at least MIN_QUALIFYING_SIGNALS
// signals to be considered "eligible" as a best call.
export const MIN_SIGNAL_THRESHOLD = 6.0;
export const MIN_QUALIFYING_SIGNALS = 3;

/**
 * Compute weighted score (0-10) from the six signal scores.
 * Missing / invalid signals are treated as 0.
 */
export function computeWeightedScore(scores) {
  let total = 0;
  for (const key of SIGNAL_KEYS) {
    const raw = Number(scores?.[key]);
    const clean = Number.isFinite(raw) ? Math.max(0, Math.min(10, raw)) : 0;
    total += clean * SIGNAL_WEIGHTS[key];
  }
  return Number(total.toFixed(2));
}

/**
 * True if the call clears MIN_SIGNAL_THRESHOLD on at least
 * MIN_QUALIFYING_SIGNALS of the six signals.
 */
export function isEligibleForBestCall(scores) {
  const qualifying = SIGNAL_KEYS.filter(
    (k) => Number(scores?.[k]) >= MIN_SIGNAL_THRESHOLD
  ).length;
  return qualifying >= MIN_QUALIFYING_SIGNALS;
}

/**
 * Given a flat list of already-scored calls, group by agentId and return
 * the highest-weighted call per agent.
 *
 * Preference order per agent:
 *   1. Highest weighted_score among *eligible* calls
 *   2. If no eligible calls, highest weighted_score overall
 *      (returned with eligible_for_best_call = false)
 */
export function pickBestCallPerAgent(scoredCalls) {
  const byAgent = new Map();
  for (const call of scoredCalls) {
    if (!byAgent.has(call.agent_id)) byAgent.set(call.agent_id, []);
    byAgent.get(call.agent_id).push(call);
  }

  const best = [];
  for (const [, calls] of byAgent) {
    const eligible = calls.filter((c) => c.eligible_for_best_call);
    const pool = eligible.length > 0 ? eligible : calls;
    pool.sort((a, b) => b.weighted_score - a.weighted_score);
    best.push(pool[0]);
  }

  // Sort output by weighted_score desc so the strongest weekly winners come first.
  best.sort((a, b) => b.weighted_score - a.weighted_score);
  return best;
}
