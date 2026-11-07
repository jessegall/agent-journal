from core.base.database.migration import Migration


class AgentLineTextIndexMigration(Migration):
    """Indexes queued agent lines by source and text."""

    number = 21
    statements = ["CREATE INDEX agent_lines_source_text ON agent_lines (source, text)"]
