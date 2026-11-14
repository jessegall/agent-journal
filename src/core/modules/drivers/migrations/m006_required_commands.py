from engine.database.migration import Migration


class RequiredCommandsMigration(Migration):
    """Names the rows for what they hold: a command a line requires, closed once it ran or was skipped."""

    number = 6
    statements = ("ALTER TABLE nudge_debts RENAME TO required_commands",
                  "ALTER TABLE required_commands RENAME COLUMN pays TO required_command",
                  "ALTER TABLE required_commands RENAME COLUMN settled_at TO closed_at",
                  "DROP INDEX nudge_debts_open",
                  "CREATE INDEX required_commands_open ON required_commands (agent_id, closed_at)")
