from engine.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class AgentFoldsMigration(Migration):
    """Makes the record of main agent rows folded into their environment's one main agent: each folded agent
    whole, with the agent it became, and each row a fold removed or changed to settle a clash."""

    number = 27
    statements = [
        "CREATE TABLE IF NOT EXISTS agent_folds (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " folded_agent_id INTEGER NOT NULL, survivor_id INTEGER NOT NULL, folded_number INTEGER NOT NULL, agent_row TEXT NOT NULL CHECK (json_valid(agent_row)),"
        " actor_row TEXT NOT NULL CHECK (json_valid(actor_row)), sessions TEXT NOT NULL CHECK (json_valid(sessions)), folded_at TEXT NOT NULL," + COMMON,
        "CREATE UNIQUE INDEX IF NOT EXISTS agent_folds_folded_agent ON agent_folds (folded_agent_id)",
        "CREATE INDEX IF NOT EXISTS agent_folds_environment_number ON agent_folds (environment_id, folded_number)",
        "CREATE TABLE IF NOT EXISTS agent_fold_rows (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " fold_id INTEGER NOT NULL REFERENCES agent_folds(id) ON DELETE CASCADE, table_name TEXT NOT NULL, row TEXT NOT NULL CHECK (json_valid(row)),"
        " rule TEXT NOT NULL," + COMMON,
        "CREATE INDEX IF NOT EXISTS agent_fold_rows_fold ON agent_fold_rows (fold_id, id)",
    ]
