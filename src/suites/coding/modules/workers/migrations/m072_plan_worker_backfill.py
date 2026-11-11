from engine.database.migration import Migration

PLAN_KEY = '$."journal.core.plans"'
OPEN_PLAN_WORKERS = (
    "FROM plan_tasks"
    " JOIN tasks ON tasks.id = plan_tasks.task_id AND tasks.closed_at IS NULL"
    " JOIN assignments ON assignments.subject_model = 'task' AND assignments.subject_id = tasks.id"
    " JOIN agents ON agents.id = assignments.actor_id AND agents.role = 'worker'"
    " WHERE plan_tasks.plan_id = plans.id"
)


class PlanWorkerBackfillMigration(Migration):
    """Names the worker of each approved or started plan whose open tasks one worker holds, for the plans
    dispatched before a dispatch named the plan's worker, so the worker reads the plan as its unit."""

    number = 72
    statements = [
        f"UPDATE plans SET metadata = json_set(metadata, '{PLAN_KEY}', json_set(coalesce(json_extract(metadata, '{PLAN_KEY}'), json('{{}}')), '$.assignee_id',"
        f" (SELECT min(assignments.actor_id) {OPEN_PLAN_WORKERS}))), version = version + 1"
        f" WHERE state IN ('approved', 'started') AND json_extract(metadata, '{PLAN_KEY}.assignee_id') IS NULL"
        f" AND (SELECT count(DISTINCT assignments.actor_id) {OPEN_PLAN_WORKERS}) = 1"
    ]
