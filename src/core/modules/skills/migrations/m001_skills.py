from core.base.database.migration import Migration


class SkillsTablesMigration(Migration):
    """Creates the table of the skills each agent has due or loaded."""

    number = 1
    statements = (
        "CREATE TABLE agent_skills (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, skill TEXT NOT NULL, digest TEXT NOT NULL DEFAULT '',"
        " state TEXT NOT NULL DEFAULT 'due', loaded_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (agent_id, skill)) STRICT",
    )
