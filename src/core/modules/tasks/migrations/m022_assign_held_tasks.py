from core.base.database.migration import Migration


class TaskHolderDelegationMigration(Migration):
    """Assigns every task an agent has in hand to that agent, now that starting a task assigns it."""

    number = 22
    statements = ["UPDATE tasks SET delegated_to = holder_id WHERE delegated_to IS NULL AND holder_id IS NOT NULL AND holder_id IN (SELECT id FROM agents) AND state IN ('started', 'testing', 'blocked')"]
