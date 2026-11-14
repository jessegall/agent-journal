from engine.database.migration import Migration


class TaskPriorityNumberMigration(Migration):
    """A task's priority becomes a number: low 100, normal 200, high 300, critical 400."""

    number = 5
    statements = (
        "DROP TRIGGER IF EXISTS tasks_rule_priority_insert",
        "DROP TRIGGER IF EXISTS tasks_rule_priority_update",
        "DROP VIEW IF EXISTS task_cards",
        "ALTER TABLE tasks ADD COLUMN priority_number INTEGER NOT NULL DEFAULT 200",
        "UPDATE tasks SET priority_number = CASE priority WHEN 'low' THEN 100 WHEN 'high' THEN 300 ELSE 200 END",
        "ALTER TABLE tasks DROP COLUMN priority",
        "ALTER TABLE tasks RENAME COLUMN priority_number TO priority",
        "CREATE VIEW task_cards AS SELECT id, environment_id, title, state, priority, reason, closed_at FROM tasks",
    )
