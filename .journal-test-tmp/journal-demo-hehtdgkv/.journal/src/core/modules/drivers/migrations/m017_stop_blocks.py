from core.base.database.migration import Migration


class StopBlocksMigration(Migration):
    """A block may hold an agent's stop alone, so a run going on no longer holds its other tools."""

    number = 17
    statements = ["ALTER TABLE agent_blocks ADD COLUMN stop_only INTEGER NOT NULL DEFAULT 0",
                  "UPDATE agent_blocks SET stop_only = 1 WHERE closed_at IS NULL AND condition_name = 'output-monitored'"]
