from engine.database.migration import Migration


class QuestionAgentStateIndexMigration(Migration):
    """Indexes questions of an agent in each state."""

    number = 3
    statements = ["CREATE INDEX questions_agent_state ON questions (agent_id, state, id)"]
