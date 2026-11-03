PLAN_TASKS_SELECT = (
    "SELECT phase_tasks.task_id, phases.plan_id, phase_tasks.phase_id, phases.position AS phase_position, phases.checkpoint,"
    " phase_tasks.position, tasks.state, tasks.priority, tasks.closed_at"
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

PLAN_CARDS_SELECT = (
    "SELECT plans.id, plans.environment_id, plans.title, plans.state,"
    " plan_progress.task_count, plan_progress.completed_count, plan_progress.current_phase"
    " FROM plans"
    " JOIN plan_progress ON plan_progress.plan_id = plans.id"
)

PLAN_EVENT_ROWS_SELECT = (
    "SELECT plan_tasks.plan_id, 'made:' || tasks.id AS event_key, tasks.created_at AS time, 'made' AS event_type, tasks.id AS task_id, tasks.title, NULL AS text"
    " FROM plan_tasks JOIN tasks ON tasks.id = plan_tasks.task_id"
    " UNION ALL SELECT plan_tasks.plan_id, 'ended:' || tasks.id, tasks.closed_at, CASE WHEN tasks.state = 'cancelled' THEN 'cancelled' ELSE 'completed' END, tasks.id, tasks.title,"
    " CASE WHEN tasks.state = 'cancelled' THEN tasks.reason ELSE tasks.outcome END"
    " FROM plan_tasks JOIN tasks ON tasks.id = plan_tasks.task_id WHERE tasks.closed_at IS NOT NULL"
    " UNION ALL SELECT plan_tasks.plan_id, 'logged:' || task_logs.id, task_logs.created_at, 'logged', tasks.id, tasks.title, task_logs.line"
    " FROM task_logs JOIN plan_tasks ON plan_tasks.task_id = task_logs.task_id JOIN tasks ON tasks.id = task_logs.task_id"
)

PLAN_OUTLINE_TASKS_SELECT = (
    "SELECT plan_tasks.task_id, plan_tasks.plan_id, plan_tasks.phase_id, plan_tasks.phase_position, plan_tasks.priority, plan_tasks.state, tasks.title,"
    " CASE WHEN agents.role = 'worker' THEN tasks.holder_id END AS worker_id"
    " FROM plan_tasks"
    " JOIN tasks ON tasks.id = plan_tasks.task_id"
    " LEFT JOIN agents ON agents.id = tasks.holder_id"
)
