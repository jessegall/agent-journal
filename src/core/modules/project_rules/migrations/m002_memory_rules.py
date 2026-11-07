from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL

PERMANENT_MEMORIES = "state = 'active' AND (environment_id IS NULL OR type = 'rule')"
MOVED_REASON = "moved to rules"


class MemoryRulesMigration(Migration):
    """Turns every active project memory and rule memory into a rule, once per text, and removes the rule type of
    memories and the memories of no environment."""

    number = 2
    statements = (
        "INSERT INTO rules (creator_id, text, created_at, updated_at)"
        " SELECT MIN(creator_id), text, MIN(created_at), MAX(updated_at) FROM memories"
        f" WHERE {PERMANENT_MEMORIES} AND text NOT IN (SELECT text FROM rules) GROUP BY text",
        f"UPDATE memories SET state = 'removed', removed_at = {TIMESTAMP_SQL}, updated_at = {TIMESTAMP_SQL},"
        f" reason = '{MOVED_REASON}', version = version + 1 WHERE {PERMANENT_MEMORIES}",
        "DELETE FROM memories WHERE environment_id IS NULL",
        "UPDATE memories SET type = 'fact' WHERE type = 'rule'",
        "DELETE FROM memory_types WHERE name = 'rule'",
    )
