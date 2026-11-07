from core.base.database.migration import Migration


class DispatchSubagentMigration(Migration):
    """A dispatch knows the subagent it started, so that agent's card can show its profile, name and instruction."""

    number = 11
    statements = ["ALTER TABLE subagent_dispatches ADD COLUMN subagent_id INTEGER"]
