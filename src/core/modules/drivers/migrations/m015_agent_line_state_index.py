from core.base.database.migration import Migration


class AgentLineStateIndexMigration(Migration):
    """Indexes waiting agent lines for repeated reads."""

    number = 15
    statements = ["CREATE INDEX agent_lines_state ON agent_lines (state, id)"]
