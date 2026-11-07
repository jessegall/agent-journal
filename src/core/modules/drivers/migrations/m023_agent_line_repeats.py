from core.base.database.migration import Migration


class AgentLineRepeatsMigration(Migration):
    """Adds the explicit policy for repeating a waking line without an intervening hook."""

    number = 23
    statements = ["ALTER TABLE agent_lines ADD COLUMN repeats_without_hook INTEGER NOT NULL DEFAULT 0"]
