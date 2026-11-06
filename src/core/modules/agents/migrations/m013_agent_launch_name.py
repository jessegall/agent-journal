from core.base.database.migration import Migration


class AgentLaunchNameMigration(Migration):
    """An agent keeps the launch name its program runs under once a session id took its place, so a new session
    id of that program finds the agent."""

    number = 13
    statements = ["ALTER TABLE agents ADD COLUMN launch_name TEXT",
                  "CREATE INDEX agents_launch_name ON agents (launch_name)"]
