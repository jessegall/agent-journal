from engine.database.migration import Migration


class ExecutionColumnsMigration(Migration):
    """Keeps a run's place in its lane across a restart: the class it was given, the priority it first had and when
    it was last raised; the lane follows from the class. A request run keeps when it entered and started, so the
    wait shows. An older run gets no class and agent as its first priority, which its next classifying run
    overwrites."""

    number = 79
    statements = ["ALTER TABLE processes ADD COLUMN execution_class TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE processes ADD COLUMN first_priority INTEGER NOT NULL DEFAULT 3",
                  "ALTER TABLE processes ADD COLUMN raised_at TEXT",
                  "UPDATE processes SET first_priority = priority",
                  "ALTER TABLE request_runs ADD COLUMN entered_at TEXT",
                  "ALTER TABLE request_runs ADD COLUMN started_at TEXT"]
