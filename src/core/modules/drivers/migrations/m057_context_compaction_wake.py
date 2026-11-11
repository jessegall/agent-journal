from engine.database.migration import Migration

OPEN_STATES = "('requested', 'started')"


class ContextCompactionWakeMigration(Migration):
    """Gives each compaction the time its agent was woken after it, and lets an agent have one open compaction at
    most: an older open row of an agent is given up, then the index refuses a second open row."""

    number = 57
    statements = [
        "ALTER TABLE context_compactions ADD COLUMN woken_at TEXT",
        f"UPDATE context_compactions SET state = 'abandoned' WHERE state IN {OPEN_STATES}"
        f" AND id NOT IN (SELECT MAX(id) FROM context_compactions WHERE state IN {OPEN_STATES} GROUP BY session_agent_id)",
        f"CREATE UNIQUE INDEX context_compactions_one_open ON context_compactions (session_agent_id) WHERE state IN {OPEN_STATES}",
    ]
