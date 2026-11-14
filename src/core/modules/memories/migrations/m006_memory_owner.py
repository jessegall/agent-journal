from engine.database.migration import Migration


class MemoryOwnerMigration(Migration):
    """Sets the owner of each memory: the id of the agent that made it, or no id for the main agent."""

    number = 6
    statements = ["UPDATE memories SET agent_id = creator_id WHERE agent_id IS NULL AND creator_id IN (SELECT id FROM agents WHERE role != 'main')",
                  "UPDATE memories SET agent_id = NULL WHERE agent_id IN (SELECT id FROM agents WHERE role = 'main')",
                  "CREATE INDEX memory_marks_agent_opened ON memory_marks (agent_id, opened_at)",
                  "CREATE INDEX memories_state ON memories (state, id)"]
