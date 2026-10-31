from core.base.database.migration import Migration


class SkillRequestsTableMigration(Migration):
    """Creates the table of the skills other modules ask an agent to read."""

    number = 2
    statements = (
        "CREATE TABLE skill_requests (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, skill TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
