from engine.database.migration import Migration

PLAN_KEY = '$."journal.core.plans"'
MIGRATION_TIMESTAMP = "strftime('%Y-%m-%dT%H:%M:%S', 'now') || '.000000+00:00'"
CORE_ACTOR = "(SELECT id FROM actors WHERE type = 'core' ORDER BY id LIMIT 1)"
OPEN_PLAN_WORKERS = (
    "FROM phase_tasks"
    " JOIN phases ON phases.id = phase_tasks.phase_id"
    " JOIN tasks ON tasks.id = phase_tasks.task_id AND tasks.closed_at IS NULL"
    " JOIN assignments ON assignments.subject_model = 'task' AND assignments.subject_id = tasks.id"
    " JOIN agents ON agents.id = assignments.actor_id AND agents.role = 'worker'"
    " WHERE phases.plan_id = plans.id"
)


class PlanWorkerBackfillMigration(Migration):
    """Assigns each approved or started plan whose open tasks one worker holds to that worker, for the plans
    dispatched before a dispatch named the plan's worker, so the worker reads the plan as its unit."""

    number = 72
    statements = [
        "INSERT INTO assignments (creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        f" SELECT {CORE_ACTOR}, 'plan', plans.id, (SELECT min(assignments.actor_id) {OPEN_PLAN_WORKERS}), NULL, 1, '{{}}', {MIGRATION_TIMESTAMP}, {MIGRATION_TIMESTAMP}"
        " FROM plans WHERE state IN ('approved', 'started')"
        " AND NOT EXISTS (SELECT 1 FROM assignments WHERE subject_model = 'plan' AND subject_id = plans.id)"
        f" AND json_extract(metadata, '{PLAN_KEY}.assignee_id') IS NULL"
        f" AND (SELECT count(DISTINCT assignments.actor_id) {OPEN_PLAN_WORKERS}) = 1"
    ]
