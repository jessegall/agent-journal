from engine.database.migration import Migration


class CountdownsMigration(Migration):
    """Keeps how far each actor's countdowns have counted, and from which count a block says its countdown."""

    number = 48
    statements = [
        "CREATE TABLE countdowns (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, subject TEXT NOT NULL, used_count INTEGER NOT NULL DEFAULT 0,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX countdowns_read ON countdowns (actor_id, key)",
        "ALTER TABLE agent_blocks ADD COLUMN countdown_from INTEGER NOT NULL DEFAULT 3",
    ]
