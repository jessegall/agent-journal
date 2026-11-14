from engine.database.migration import Migration

COMMON_COLUMNS = "id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class AssignRulesMigration(Migration):
    """Creates the tables of the assign rules, their conditions and the decision made about each task."""

    number = 1
    statements = (
        f"CREATE TABLE assign_rules ({COMMON_COLUMNS}, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id),"
        " position INTEGER NOT NULL, enabled INTEGER NOT NULL DEFAULT 1, target TEXT NOT NULL, agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL, program TEXT NOT NULL DEFAULT '',"
        " program_model TEXT NOT NULL DEFAULT '', queue_limit INTEGER NOT NULL DEFAULT 0)",
        "CREATE UNIQUE INDEX assign_rules_position ON assign_rules (environment_id, position)",
        f"CREATE TABLE assign_rule_conditions ({COMMON_COLUMNS}, rule_id INTEGER NOT NULL REFERENCES assign_rules(id) ON DELETE CASCADE, field TEXT NOT NULL, operator TEXT NOT NULL, value TEXT NOT NULL DEFAULT '')",
        "CREATE INDEX assign_rule_conditions_rule ON assign_rule_conditions (rule_id)",
        f"CREATE TABLE assign_decisions ({COMMON_COLUMNS}, task_id INTEGER NOT NULL UNIQUE REFERENCES tasks(id) ON DELETE CASCADE, rule_id INTEGER REFERENCES assign_rules(id) ON DELETE SET NULL,"
        " outcome TEXT NOT NULL, actor_id INTEGER REFERENCES actors(id) ON DELETE SET NULL, reason TEXT NOT NULL DEFAULT '')",
    )
