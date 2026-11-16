from engine.database.migration import Migration


class CompactionNoticeAgentIdMigration(Migration):
    """A compaction notice names its agent by the agent's id alone, so the number it kept beside it goes."""

    number = 86
    statements = ("ALTER TABLE context_compaction_notices DROP COLUMN agent_number",)
