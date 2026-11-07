HOOK_CALL_ROWS_SELECT = (
    "SELECT id, session_agent_id, hook, tool, summary, answer, refusal,"
    " coalesce(json_extract(metadata, '$.\"journal.core.drivers\".stop_checks'), '[]') AS stop_checks FROM hook_calls"
)

AGENT_ACTIVITIES_SELECT = (
    "SELECT agents.id, agents.parent_id, agents.created_at, agents.ended_at,"
    " (SELECT hook_calls.created_at FROM hook_calls WHERE hook_calls.session_agent_id = agents.id AND hook_calls.hook <> 'tick'"
    " ORDER BY hook_calls.id DESC LIMIT 1) AS last_hook_at FROM agents"
)

NUDGE_TOTALS_SELECT = (
    "SELECT key AS nudge_key, sum(delivery_count) AS delivery_count, coalesce(max(last_delivered_at), '') AS last_delivered_at"
    " FROM nudge_records GROUP BY key"
)


TOOL_USE_COUNT_TERM = "coalesce(sum(created_at > ?), 0)"
TOOL_USE_COUNTS_SELECT = "SELECT {sums} FROM hook_calls WHERE session_agent_id = ? AND hook = ? AND created_at > ?"


def tool_use_counts_select(start_count: int) -> str:
    return TOOL_USE_COUNTS_SELECT.format(sums=", ".join(TOOL_USE_COUNT_TERM for _ in range(start_count)))


ENVIRONMENT_MENU_ROWS_SELECT = (
    "SELECT environments.id, environments.name, environments.folder, environments.branch,"
    " coalesce((SELECT json_extract(settings.value, '$') FROM settings WHERE settings.environment_id = environments.id AND settings.key = 'journal.core.drivers.suite'),"
    " (SELECT json_extract(settings.value, '$') FROM settings WHERE settings.environment_id IS NULL AND settings.key = 'journal.core.drivers.suite'), '') AS suite_setting,"
    " EXISTS (SELECT 1 FROM agents WHERE agents.environment_id = environments.id AND agents.role = 'main' AND agents.ended_at IS NULL) AS main_running FROM environments WHERE environments.test = 0"
)
