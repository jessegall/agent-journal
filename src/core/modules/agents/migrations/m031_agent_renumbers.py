from engine.database.migration import Migration


class AgentRenumbersMigration(Migration):
    """Keeps the renumber of agents: each staying agent's old and new id with its role and when it was told,
    and one summary row of the run, for the folder renames and the notices that follow it."""

    number = 31
    statements = (
        "CREATE TABLE IF NOT EXISTS agent_renumbers (old_id INTEGER PRIMARY KEY, new_id INTEGER NOT NULL UNIQUE, role TEXT NOT NULL, announced_at TEXT) STRICT",
        "CREATE TABLE IF NOT EXISTS agent_renumber_summary (id INTEGER PRIMARY KEY CHECK (id = 1), copy TEXT NOT NULL, counts TEXT NOT NULL CHECK (json_valid(counts)),"
        " folders_done INTEGER NOT NULL DEFAULT 0, renumbered_at TEXT NOT NULL, announced_at TEXT) STRICT",
    )
