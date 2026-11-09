from core.modules.tasks.models.support.views import AUTOMATIC_TASK_WAIT, TASK_HELPER_MATCH, TASK_TAGS_SELECT, USER_TASK_WAIT

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
    " (SELECT count(*) FROM plan_tasks WHERE plan_tasks.plan_id = plans.id AND plan_tasks.state = 'testing') AS testing_count,"
    " coalesce((SELECT min(plan_tasks.phase_position) FROM plan_tasks"
    " WHERE plan_tasks.plan_id = plans.id AND plan_tasks.closed_at IS NULL), 0) AS current_phase"
    " FROM plans"
)

PLAN_CARDS_SELECT = (
    "SELECT plans.id, plans.environment_id, plans.title, plans.state,"
    " plan_progress.task_count, plan_progress.completed_count, plan_progress.testing_count, plan_progress.current_phase,"
    " max(plans.updated_at, coalesce((SELECT max(tasks.updated_at) FROM plan_tasks JOIN tasks ON tasks.id = plan_tasks.task_id"
    " WHERE plan_tasks.plan_id = plans.id), plans.updated_at)) AS changed_at,"
    " (SELECT json_group_array(json_object('id', helper.id, 'name', coalesce(nullif(helper.given_name, ''), 'Agent ' || helper.id), 'main', helper.role = 'main', 'task_id', tasks.id, 'task_title', tasks.title))"
    " FROM plan_tasks"
    " JOIN tasks ON tasks.id = plan_tasks.task_id"
    f" JOIN agents AS helper ON {TASK_HELPER_MATCH}"
    " WHERE plan_tasks.plan_id = plans.id AND plan_tasks.closed_at IS NULL) AS agents,"
    " (SELECT json_group_array(json_object('id', tasks.id, 'title', tasks.title))"
    " FROM plan_tasks JOIN tasks ON tasks.id = plan_tasks.task_id"
    " WHERE plan_tasks.plan_id = plans.id AND plan_tasks.state = 'started') AS working"
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
    " tasks.complexity, tasks.reason, tasks.delegated_to,"
    f" {TASK_TAGS_SELECT}"
    f" ({AUTOMATIC_TASK_WAIT} AND NOT {USER_TASK_WAIT}) AS automatic,"
    " coalesce((SELECT agents.role = 'main' FROM agents WHERE agents.id = tasks.delegated_to), 0) AS main_delegate,"
    " helper.id AS helper_id, coalesce(nullif(helper.given_name, ''), 'Agent ' || helper.id) AS helper_name,"
    " coalesce(helper.role = 'main', 0) AS helper_main"
    " FROM plan_tasks"
    " JOIN tasks ON tasks.id = plan_tasks.task_id"
    f" LEFT JOIN agents AS helper ON {TASK_HELPER_MATCH}"
)
