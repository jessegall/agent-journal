from engine.database.migration import Migration


class AsksTablesMigration(Migration):
    """Creates the asks table, a question a helper asked its parent, and the ask_steps table, each level the
    question reached."""

    number = 1
    statements = (
        "CREATE TABLE asks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, asker_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " parent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, topic TEXT NOT NULL, text TEXT NOT NULL,"
        " facts_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(facts_json)), wait_id INTEGER REFERENCES task_waits(id) ON DELETE RESTRICT,"
        " task_id INTEGER REFERENCES tasks(id) ON DELETE RESTRICT, stack_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(stack_json)),"
        " level_index INTEGER NOT NULL DEFAULT 0, outcome TEXT, closed_at TEXT, parent_ask_id INTEGER REFERENCES asks(id) ON DELETE RESTRICT,"
        " group_key TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE ask_steps (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " ask_id INTEGER NOT NULL REFERENCES asks(id) ON DELETE RESTRICT, profile TEXT NOT NULL DEFAULT '', helper_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT,"
        " job_id INTEGER REFERENCES helper_jobs(id) ON DELETE RESTRICT, state TEXT NOT NULL DEFAULT 'waiting', received_at TEXT, due_at TEXT, forward_at TEXT,"
        " visit_count INTEGER NOT NULL DEFAULT 0, reason TEXT NOT NULL DEFAULT '', tried TEXT NOT NULL DEFAULT '',"
        " options_json TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(options_json)), recommendation TEXT NOT NULL DEFAULT '',"
        " passed_by_journal INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX ask_steps_ask ON ask_steps (ask_id, id)",
        "CREATE INDEX ask_steps_profile ON ask_steps (profile, state)",
        "CREATE INDEX ask_steps_open_due ON ask_steps (due_at) WHERE state IN ('waiting', 'delivered')",
        "CREATE INDEX asks_asker ON asks (asker_id, closed_at)",
        "CREATE INDEX asks_asker_group ON asks (asker_id, group_key)",
        "CREATE INDEX asks_open ON asks (environment_id) WHERE closed_at IS NULL",
    )
