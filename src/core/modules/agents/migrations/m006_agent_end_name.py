from core.base.database.migration import Migration


class AgentEndNameMigration(Migration):
    """Gives the agent events no listener has passed yet the name of their change."""

    number = 6
    statements = [
        "UPDATE events SET name = 'agent.end' WHERE name = 'agent.update' AND json_extract(data, '$.ended_at[1]') IS NOT NULL"
        " AND json_extract(data, '$.ended_at[0]') IS NULL AND id > (SELECT coalesce(min(event_id), 0) FROM listener_cursors)"
    ]
