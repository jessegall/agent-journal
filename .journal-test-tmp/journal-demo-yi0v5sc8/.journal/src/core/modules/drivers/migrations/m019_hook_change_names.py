from core.base.database.migration import Migration

UNHANDLED = "id > (SELECT coalesce(min(event_id), 0) FROM listener_cursors)"


class HookChangeNamesMigration(Migration):
    """Gives the hook events no listener has passed yet the name of their change."""

    number = 19
    statements = tuple(
        f"UPDATE events SET name = 'hook_call.{name}' WHERE name = 'hook_call.create' AND {condition} AND {UNHANDLED}"
        for name, condition in (
            ("compact", "json_extract(data, '$.hook[1]') = 'compact'"),
            ("session_start", "json_extract(data, '$.hook[1]') = 'session_start'"),
            ("prompt", "json_extract(data, '$.hook[1]') = 'prompt'"),
            ("stop_allowed", "json_extract(data, '$.hook[1]') = 'stop' AND json_extract(data, '$.answer[1]') = 'allowed'"),
            ("stop_refused", "json_extract(data, '$.hook[1]') = 'stop' AND json_extract(data, '$.answer[1]') != 'allowed'"),
        )
    )
