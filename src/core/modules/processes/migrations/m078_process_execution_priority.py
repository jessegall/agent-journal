from engine.database.migration import Migration


class ProcessExecutionPriorityMigration(Migration):
    """Stores a process's priority as the execution priority it waits with, a number from background (1)
    to immediate (5), in place of the old text high, normal or low: high becomes agent and low becomes
    background."""

    number = 78
    statements = ["ALTER TABLE processes ADD COLUMN execution_priority INTEGER NOT NULL DEFAULT 2",
                  "UPDATE processes SET execution_priority = CASE priority WHEN 'high' THEN 3 WHEN 'low' THEN 1 ELSE 2 END",
                  "ALTER TABLE processes DROP COLUMN priority",
                  "ALTER TABLE processes RENAME COLUMN execution_priority TO priority"]
