from engine.database.migration import Migration


class ReadIndexesMigration(Migration):
    """Indexes agent lines by their hook call, and hook calls that ran a project hook."""

    number = 28
    statements = ["CREATE INDEX agent_lines_hook_call ON agent_lines (hook_call_id)", "CREATE INDEX hook_calls_foreign ON hook_calls (id) WHERE json_type(metadata, '$.\"journal.core.drivers\".foreign') IS NOT NULL"]
