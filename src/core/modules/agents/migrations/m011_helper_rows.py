from engine.database.migration import Migration


class HelperRowsMigration(Migration):
    """Rows of the removed subagent role become ended, read-only helpers."""

    number = 11
    statements = ["UPDATE agents SET access = 'read-only', ended_at = coalesce(ended_at, updated_at) WHERE role = 'subagent'",
                  "UPDATE agents SET role = 'helper' WHERE role = 'subagent'"]
