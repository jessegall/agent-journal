from engine.database.migration import Migration


class AskStacksTableMigration(Migration):
    """Creates the ask_stacks table: for each topic the levels a question goes up, one open row approved and at
    most one waiting for approval."""

    number = 2
    statements = (
        "CREATE TABLE ask_stacks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, topic TEXT NOT NULL,"
        " levels_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(levels_json)), needs_approval INTEGER NOT NULL DEFAULT 0, ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX ask_stacks_open ON ask_stacks (environment_id, topic) WHERE ended_at IS NULL AND needs_approval = 0",
        "CREATE UNIQUE INDEX ask_stacks_waiting ON ask_stacks (environment_id, topic) WHERE ended_at IS NULL AND needs_approval = 1",
    )
