USER_TASK_WAIT = "EXISTS(SELECT 1 FROM task_waits WHERE task_id = tasks.id AND ended_at IS NULL AND target = 'user')"
AUTOMATIC_TASK_WAIT = "EXISTS(SELECT 1 FROM task_waits WHERE task_id = tasks.id AND ended_at IS NULL AND (command != '' OR target != 'user'))"

OPEN_DEPENDENCIES_SELECT = (
    "SELECT task_dependencies.id, task_dependencies.task_id, task_dependencies.dependency_id"
    " FROM task_dependencies"
    " JOIN tasks ON tasks.id = task_dependencies.dependency_id"
    " JOIN tasks AS dependent ON dependent.id = task_dependencies.task_id"
    " WHERE tasks.closed_at IS NULL"
    " AND NOT (tasks.state IN ('started', 'testing') AND tasks.delegated_to IS NOT NULL AND tasks.delegated_to = dependent.delegated_to)"
)

TASK_TAGS_SELECT = (
    " (SELECT coalesce('[' || group_concat(json_quote(word)) || ']', '[]') FROM"
    " (SELECT word FROM task_tags WHERE task_id = tasks.id ORDER BY word)) AS tags,"
)

TASK_CARDS_SELECT = (
    "SELECT tasks.id, tasks.environment_id, tasks.title, tasks.state, tasks.priority, tasks.complexity, tasks.reason, tasks.closed_at, tasks.delegated_to,"
    f" {TASK_TAGS_SELECT}"
    f" ({AUTOMATIC_TASK_WAIT} AND NOT {USER_TASK_WAIT}) AS automatic, "
    " (SELECT coalesce(nullif(agents.given_name, ''), 'Agent ' || agents.id) FROM agents WHERE agents.id = tasks.delegated_to) AS delegated_name"
    " FROM tasks"
)

TASK_TAG_COUNTS_SELECT = "SELECT word, count(*) AS count FROM task_tags GROUP BY word"

TASK_EDGES_SELECT = (
    "SELECT task_id, dependency_id AS blocker_id FROM task_dependencies"
    " UNION SELECT task_id, CAST(substr(target, 7) AS INTEGER) FROM task_waits WHERE ended_at IS NULL AND target LIKE 'tasks:%'"
)

TASK_INSPECTIONS_SELECT = (
    "SELECT tasks.id AS task_id,"
    f" {TASK_TAGS_SELECT}"
    " (SELECT json_group_array(json_object('id', waited.id, 'title', waited.title, 'state', waited.state)) FROM task_dependencies"
    " JOIN tasks AS waited ON waited.id = task_dependencies.dependency_id WHERE task_dependencies.task_id = tasks.id) AS waits,"
    " (SELECT json_group_array(json_object('id', latest.id, 'line', latest.line, 'created_at', latest.created_at)) FROM"
    " (SELECT task_logs.id, task_logs.line, task_logs.created_at FROM task_logs WHERE task_logs.task_id = tasks.id ORDER BY task_logs.id DESC LIMIT 100) AS latest) AS logs,"
    " (SELECT json_group_array(json_object('id', task_waits.id, 'command', task_waits.command, 'target', task_waits.target)) FROM task_waits"
    " WHERE task_waits.task_id = tasks.id AND task_waits.ended_at IS NULL) AS openers,"
    " (SELECT json_group_array(json_object('id', renewal.id, 'reason', renewal.reason, 'created_at', renewal.created_at))"
    " FROM (SELECT id, reason, created_at FROM task_block_renewals WHERE task_id = tasks.id ORDER BY id) AS renewal) AS block_renewals,"
    " helper.id AS helper_id, coalesce(nullif(helper.given_name, ''), 'Agent ' || helper.id) AS helper_name"
    " FROM tasks"
    " LEFT JOIN agents AS helper ON helper.id = coalesce(tasks.delegated_to, tasks.holder_id) AND helper.role != 'main'"
)

TASK_BLOCK_REVIEWS_SELECT = (
    "SELECT tasks.id AS task_id, agents.id AS session_agent_id, tasks.environment_id, tasks.state, tasks.version AS task_version,"
    " coalesce((SELECT max(task_version) FROM task_block_renewals WHERE task_id = tasks.id), 0) AS block_version,"
    " max(coalesce((SELECT max(created_at) FROM task_block_renewals WHERE task_id = tasks.id), tasks.updated_at),"
    " coalesce((SELECT max(last_delivered_at) FROM nudge_records WHERE session_agent_id = agents.id"
    " AND key = 'tasks.block_review.' || tasks.id), '')) AS reviewed_at,"
    f" {USER_TASK_WAIT} AS user_wait,"
    f" {AUTOMATIC_TASK_WAIT} AS automatic"
    " FROM tasks JOIN agents ON agents.environment_id = tasks.environment_id AND agents.role = 'main'"
)

ENVIRONMENT_CARDS_SELECT = (
    "SELECT environments.id, environments.name, environments.folder, environments.branch,"
    " (SELECT count(*) FROM agents WHERE agents.environment_id = environments.id AND agents.ended_at IS NULL) AS running_agent_count,"
    " (SELECT count(*) FROM tasks WHERE tasks.environment_id = environments.id AND tasks.state IN ('open', 'started', 'blocked', 'testing')) AS unfinished_task_count"
    " FROM environments"
)


CLOSED_TASK_COUNT_TERM = "coalesce(sum(closed_at > ?), 0)"
CLOSED_TASK_COUNTS_SELECT = "SELECT {sums} FROM tasks WHERE environment_id = COALESCE(?, environment_id) AND closed_at > ?"


def closed_task_counts_select(start_count: int) -> str:
    return CLOSED_TASK_COUNTS_SELECT.format(sums=", ".join(CLOSED_TASK_COUNT_TERM for _ in range(start_count)))
