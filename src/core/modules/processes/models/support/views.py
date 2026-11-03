PROCESS_ROWS_SELECT = "SELECT id, environment_id, agent_id, line, state FROM processes"

PROCESS_QUEUE_ROWS_SELECT = """
SELECT processes.id, processes.environment_id, processes.agent_id, processes.line, processes.category,
       processes.state, processes.created_at, processes.started_at, processes.ended_at,
       processes.is_queued, processes.slot_assigned,
       agents.role = 'main' AS is_main,
       CASE WHEN agents.role = 'worker' THEN agents.id END AS worker_id,
       (SELECT tasks.id FROM tasks WHERE (tasks.holder_id = processes.agent_id
        OR tasks.delegated_to = processes.agent_id) AND tasks.started_at <= processes.created_at
        ORDER BY tasks.started_at DESC, tasks.id DESC LIMIT 1) AS task_id,
       CASE WHEN processes.state NOT IN ('running', 'background') THEN 'recent'
            WHEN processes.is_queued = 1 THEN 'waiting' ELSE 'running' END AS section
FROM processes JOIN agents ON agents.id = processes.agent_id
WHERE processes.is_queue_run = 1
   OR (agents.role = 'main' AND processes.state IN ('running', 'background'))
"""
