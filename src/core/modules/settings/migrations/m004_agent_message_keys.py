from engine.database.migration import Migration


class AgentMessageKeysMigration(Migration):
    """The settings that named the journal's lines to an agent nudges take their agent message keys."""

    number = 4
    statements = ["UPDATE settings SET key = replace(key, '.terminal-nudges', '.terminal-agent-messages') WHERE key LIKE '%.terminal-nudges'",
                  "UPDATE settings SET key = replace(key, '.nudge-after', '.agent-message-after') WHERE key LIKE '%.nudge-after'"]
