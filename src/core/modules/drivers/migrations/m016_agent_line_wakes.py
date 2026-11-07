from core.base.database.migration import Migration


class AgentLineWakesMigration(Migration):
    """Lets a line say that it is typed to an idle agent, which sends no hook that could carry it."""

    number = 16
    statements = ["ALTER TABLE agent_lines ADD COLUMN wakes_agent INTEGER NOT NULL DEFAULT 0"]
