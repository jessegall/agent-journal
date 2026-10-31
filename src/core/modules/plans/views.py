PLAN_TASKS_SELECT = (
    "SELECT phase_tasks.task_id, phases.plan_id, phase_tasks.phase_id, phases.position AS phase_position, phases.checkpoint,"
    " phase_tasks.position, tasks.state, tasks.closed_at"
    " FROM phase_tasks"
    " JOIN phases ON phases.id = phase_tasks.phase_id"
    " JOIN tasks ON tasks.id = phase_tasks.task_id"
)

PLAN_PROGRESS_SELECT = (
    "SELECT plans.id AS plan_id,"
    " (SELECT count(*) FROM plan_tasks WHERE plan_tasks.plan_id = plans.id AND plan_tasks.state != 'cancelled') AS task_count,"
    " (SELECT count(*) FROM plan_tasks WHERE plan_tasks.plan_id = plans.id AND plan_tasks.state = 'completed') AS completed_count,"
    " coalesce((SELECT min(plan_tasks.phase_position) FROM plan_tasks"
    " WHERE plan_tasks.plan_id = plans.id AND plan_tasks.closed_at IS NULL), 0) AS current_phase"
    " FROM plans"
)
