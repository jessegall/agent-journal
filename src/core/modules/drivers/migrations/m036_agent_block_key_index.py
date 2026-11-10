from engine.database.migration import Migration


class AgentBlockKeyIndexMigration(Migration):
    number = 36
    statements = ["CREATE INDEX agent_blocks_open_key ON agent_blocks (nudge_key) WHERE closed_at IS NULL"]
