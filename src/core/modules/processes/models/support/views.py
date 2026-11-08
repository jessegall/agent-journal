PROCESS_ROWS_SELECT = "SELECT id, environment_id, session_agent_id, line, state FROM processes"

PROCESS_QUEUE_ROWS_SELECT = """
SELECT processes.id, processes.environment_id, processes.session_agent_id, processes.line, processes.category,
       processes.state, processes.exit_code, processes.created_at, processes.started_at, processes.ended_at,
       processes.queued_at, processes.is_queue_run, processes.slot_assigned, processes.plugin,
       agents.role = 'main' AS is_main,
       coalesce(processes.owner_agent_id, CASE WHEN agents.role != 'main' THEN agents.id END) AS owner_agent_id,
       coalesce(processes.task_id, (SELECT tasks.id FROM tasks WHERE (tasks.holder_id = processes.session_agent_id
        OR tasks.delegated_to = processes.session_agent_id) AND tasks.started_at <= processes.created_at
        ORDER BY tasks.started_at DESC, tasks.id DESC LIMIT 1)) AS task_id,
       CASE WHEN processes.state NOT IN ('running', 'background') THEN 'recent'
            WHEN processes.queued_at IS NOT NULL THEN 'waiting' ELSE 'running' END AS section
FROM processes JOIN agents ON agents.id = processes.session_agent_id
WHERE processes.is_queue_run = 1
   OR (agents.role = 'main' AND processes.category IN ('test run', 'build'))
"""
