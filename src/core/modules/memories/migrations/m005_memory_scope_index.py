from core.base.database.migration import Migration


class MemoryScopeIndexMigration(Migration):
    """Indexes memory scope and gives whole-table counts a covering index."""

    number = 5
    statements = ["CREATE INDEX memories_environment_agent_weight ON memories (environment_id, agent_id, weight)"]
