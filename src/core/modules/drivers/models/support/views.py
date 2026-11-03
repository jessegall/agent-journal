HOOK_CALL_ROWS_SELECT = "SELECT id, agent_id, hook, tool, summary, answer, refusal FROM hook_calls"

NUDGE_TOTALS_SELECT = (
    "SELECT key AS nudge_key, sum(delivery_count) AS delivery_count, coalesce(max(last_delivered_at), '') AS last_delivered_at"
    " FROM nudge_records GROUP BY key"
)
