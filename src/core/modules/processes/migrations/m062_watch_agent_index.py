from engine.database.migration import Migration


class WatchAgentIndexMigration(Migration):
    """Indexes the watch rows of an agent, newest first."""

    number = 62
    statements = ["CREATE INDEX watches_agent ON watches (session_agent_id, id)"]
