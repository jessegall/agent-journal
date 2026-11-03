from core.base.database.migration import Migration


class AgentLineStateIndexMigration(Migration):
    """The waiting lines of every agent are read through an index, as the worker resume retry does every few seconds."""

    number = 15
    statements = ["CREATE INDEX agent_lines_state ON agent_lines (state, id)"]
