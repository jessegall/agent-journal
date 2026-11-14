from engine.database.migration import Migration

MIGRATION_TIMESTAMP = "strftime('%Y-%m-%dT%H:%M:%S', 'now') || '.000000+00:00'"


class TaskAssignmentsMigration(Migration):
    """Copies the agent each task is delegated to into the assignments table, as an assignment given by hand.
    It copies the column delegated_to only, never the holder, and leaves out a task delegated to an actor that
    no longer exists."""

    number = 25
    statements = [
        "INSERT INTO assignments (creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        " SELECT (SELECT id FROM actors WHERE type = 'core' ORDER BY id LIMIT 1), 'task', tasks.id, tasks.delegated_to, NULL, 1, '{}',"
        f" {MIGRATION_TIMESTAMP}, {MIGRATION_TIMESTAMP}"
        " FROM tasks JOIN actors ON actors.id = tasks.delegated_to WHERE tasks.delegated_to IS NOT NULL"
        " AND NOT EXISTS (SELECT 1 FROM assignments WHERE subject_model = 'task' AND subject_id = tasks.id)",
    ]
