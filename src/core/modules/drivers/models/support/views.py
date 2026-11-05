HOOK_CALL_ROWS_SELECT = "SELECT id, session_agent_id, hook, tool, summary, answer, refusal FROM hook_calls"

AGENT_ACTIVITIES_SELECT = (
    "SELECT agents.id, agents.parent_id, agents.created_at, agents.ended_at,"
    " (SELECT hook_calls.created_at FROM hook_calls WHERE hook_calls.session_agent_id = agents.id AND hook_calls.hook <> 'tick'"
    " ORDER BY hook_calls.id DESC LIMIT 1) AS last_hook_at FROM agents"
)

NUDGE_TOTALS_SELECT = (
    "SELECT key AS nudge_key, sum(delivery_count) AS delivery_count, coalesce(max(last_delivered_at), '') AS last_delivered_at"
    " FROM nudge_records GROUP BY key"
)


def tool_use_counts_select(start_count: int) -> str:
    sums = ", ".join("coalesce(sum(created_at > ?), 0)" for _ in range(start_count))
    return f"SELECT {sums} FROM hook_calls WHERE session_agent_id = ? AND hook = ? AND created_at > ?"
