from core.base.database.view import View

PLAN_PROGRESS = View(
    "plan_progress",
    "SELECT plans.id AS plan_id,"
    " count(tasks.id) FILTER (WHERE tasks.state != 'cancelled') AS task_count,"
    " count(tasks.id) FILTER (WHERE tasks.state = 'completed') AS completed_count,"
    " coalesce(min(phases.position) FILTER (WHERE tasks.id IS NOT NULL AND tasks.closed_at IS NULL), 0) AS current_phase"
    " FROM plans"
    " LEFT JOIN phases ON phases.plan_id = plans.id"
    " LEFT JOIN phase_tasks ON phase_tasks.phase_id = phases.id"
    " LEFT JOIN tasks ON tasks.id = phase_tasks.task_id"
    " GROUP BY plans.id",
)
