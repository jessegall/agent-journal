from engine.database.migration import Migration


class BlockGracePeriodsMigration(Migration):
    """A block may hold only after a grace and be skipped, so a required command is a block and its own table goes."""

    number = 14
    statements = ["DELETE FROM agent_blocks WHERE closed_at IS NULL AND condition_text LIKE '%required-command-closed%'",
                  "ALTER TABLE agent_blocks ADD COLUMN grace_tool_uses INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE agent_blocks ADD COLUMN grace_seconds INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE agent_blocks ADD COLUMN countdown_key TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE agent_blocks ADD COLUMN countdown_text TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE agent_blocks ADD COLUMN skip_reason TEXT NOT NULL DEFAULT ''",
                  "DROP TABLE required_commands"]
