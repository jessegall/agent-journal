AGENT_CARDS_SELECT = (
    "SELECT agents.id, agents.number, agents.environment_id, agents.session, agents.role, agents.access, agents.program, agents.program_model, agents.profile, agents.given_name, agents.paused_at, agents.usage_limit_ends_at, agents.ended_at, agents.retired_at, agents.retirement_reason,"
    " (SELECT tasks.id FROM tasks WHERE tasks.holder_id = agents.id AND tasks.state = 'started' ORDER BY tasks.id DESC LIMIT 1) AS started_task_id,"
    " coalesce((SELECT tasks.title FROM tasks WHERE tasks.holder_id = agents.id AND tasks.state = 'started' ORDER BY tasks.id DESC LIMIT 1), '') AS started_task_title,"
    " (SELECT json_group_array(json_object('id', listed.id, 'title', listed.title, 'state', listed.state,"
    " 'plan_id', task_plan.id, 'plan_title', task_plan.title)) FROM ("
    "SELECT tasks.id, tasks.title, tasks.state, 0 AS part FROM tasks WHERE agents.role != 'main' AND tasks.holder_id = agents.id AND coalesce(tasks.delegated_to, 0) != agents.id"
    " UNION ALL SELECT tasks.id, tasks.title, tasks.state, 0 AS part FROM tasks WHERE agents.role = 'main' AND tasks.id ="
    " (SELECT started.id FROM tasks AS started WHERE started.holder_id = agents.id AND started.state = 'started' ORDER BY started.id DESC LIMIT 1)"
    " UNION ALL SELECT tasks.id, tasks.title, tasks.state, 1 AS part FROM tasks WHERE tasks.delegated_to = agents.id"
    " ORDER BY part, id) AS listed"
    " LEFT JOIN phase_tasks ON phase_tasks.task_id = listed.id LEFT JOIN phases ON phases.id = phase_tasks.phase_id"
    " LEFT JOIN plans AS task_plan ON task_plan.id = phases.plan_id) AS tasks,"
    " CASE WHEN agents.ended_at IS NULL THEN coalesce((SELECT min(agent_blocks.created_at) FROM agent_blocks WHERE agent_blocks.session_agent_id = agents.id AND agent_blocks.closed_at IS NULL), '') ELSE '' END AS block_started_at,"
    " CASE WHEN agents.ended_at IS NULL THEN coalesce((SELECT agent_blocks.nudge_text FROM agent_blocks WHERE agent_blocks.session_agent_id = agents.id AND agent_blocks.closed_at IS NULL ORDER BY agent_blocks.id LIMIT 1), '') ELSE '' END AS block_reason,"
    " (agents.ended_at IS NULL AND EXISTS (SELECT 1 FROM tasks WHERE tasks.holder_id = agents.id AND tasks.state = 'blocked')) AS task_blocked,"
    " coalesce((SELECT hook_calls.created_at FROM hook_calls WHERE hook_calls.session_agent_id = agents.id ORDER BY hook_calls.id DESC LIMIT 1), '') AS last_activity,"
    " coalesce(dispatch.program_model, '') AS job_model, coalesce(dispatch.profile, '') AS job_profile,"
    " coalesce(dispatch.description, '') AS job_description, coalesce(dispatch.instruction, '') AS job_instruction,"
    " coalesce(current_job.description, '') AS helper_job_description, coalesce(current_job.brief, '') AS helper_job_brief, coalesce(current_job.title, '') AS helper_job_title,"
    " coalesce(nullif(current_job.program, ''), agents.program) AS helper_job_program, current_job.new_session AS helper_job_new_session,"
    " coalesce((SELECT messages.text FROM messages WHERE messages.session_agent_id = agents.id AND messages.creator_id = agents.id"
    " AND messages.type = 'agent' AND messages.is_chat_visible = 0 ORDER BY messages.id DESC LIMIT 1),"
    " (SELECT latest.returned FROM helper_jobs AS latest WHERE latest.helper_id = agents.id ORDER BY latest.id DESC LIMIT 1), '') AS job_returned"
    " FROM agents"
    " LEFT JOIN helper_jobs AS dispatch ON dispatch.id = (SELECT min(helper_jobs.id) FROM helper_jobs WHERE helper_jobs.helper_id = agents.id)"
    " LEFT JOIN helper_jobs AS current_job ON current_job.id = (SELECT id FROM helper_jobs WHERE helper_id = agents.id ORDER BY ended_at IS NULL DESC, id DESC LIMIT 1)"
)

AGENT_LISTING_SELECT = (
    "SELECT agent_cards.*, agents.parent_id, agents.created_at, agents.updated_at, agents.process_started_at"
    " FROM agent_cards JOIN agents ON agents.id = agent_cards.id"
)

AGENT_FILTER_OPTIONS_SELECT = (
    "SELECT environment_id, json_group_array(DISTINCT role) AS roles,"
    " json_group_array(DISTINCT profile) AS profiles FROM agents GROUP BY environment_id"
)

AGENT_COUNTS_SELECT = """
SELECT environment_id, role, profile, count(*) AS kept,
       sum(CASE WHEN ended_at IS NULL THEN 1 ELSE 0 END) AS running
FROM agents WHERE retired_at IS NULL
GROUP BY environment_id, role, profile
"""
