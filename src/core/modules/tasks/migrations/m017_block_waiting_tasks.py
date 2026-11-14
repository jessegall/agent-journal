from engine.database.migration import Migration

OPEN_DEPENDENCIES = """SELECT task_dependencies.task_id, task_dependencies.dependency_id FROM task_dependencies
    JOIN tasks AS blocker ON blocker.id = task_dependencies.dependency_id
    JOIN tasks AS waiting ON waiting.id = task_dependencies.task_id
    WHERE blocker.closed_at IS NULL AND waiting.state = 'open'
    AND NOT (blocker.state IN ('started', 'testing') AND blocker.delegated_to IS NOT NULL AND blocker.delegated_to = waiting.delegated_to)"""


class BlockWaitingTasksMigration(Migration):
    """Moves every open task that waits on an open task to blocked, with a wait on that task, so it opens by itself."""

    number = 17
    statements = [
        f"""INSERT INTO task_waits (task_id, creator_id, target, created_at, updated_at)
            SELECT edge.task_id, tasks.creator_id, 'tasks:' || edge.dependency_id, tasks.updated_at, tasks.updated_at
            FROM ({OPEN_DEPENDENCIES}) AS edge JOIN tasks ON tasks.id = edge.task_id""",
        """UPDATE tasks SET state = 'blocked', version = version + 1,
            reason = 'waits on task ' || (SELECT min(CAST(substr(target, 7) AS INTEGER)) FROM task_waits
                                          WHERE task_waits.task_id = tasks.id AND task_waits.ended_at IS NULL AND task_waits.target LIKE 'tasks:%')
            WHERE state = 'open' AND EXISTS (SELECT 1 FROM task_waits WHERE task_waits.task_id = tasks.id AND task_waits.ended_at IS NULL AND task_waits.target LIKE 'tasks:%')""",
    ]
