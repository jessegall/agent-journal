WORKER_POINTS_SELECT = (
    "SELECT worker_worktrees.id AS worktree_id, worker_worktrees.session_agent_id, tasks.title AS task_title, tasks.brief AS task_brief,"
    " (SELECT json_group_array(json_object('point', proofs.point, 'state', proofs.state, 'text', proofs.text, 'shortfall', proofs.shortfall))"
    " FROM proofs WHERE proofs.worktree_id = worker_worktrees.id AND proofs.task_id = worker_worktrees.task_id) AS proofs"
    " FROM worker_worktrees"
    " JOIN tasks ON tasks.id = worker_worktrees.task_id"
)

WORKER_WAITS_SELECT = """
SELECT worktree.session_agent_id AS agent_id, worktree.environment_id,
       CASE
           WHEN EXISTS (SELECT 1 FROM tasks WHERE tasks.holder_id = worktree.session_agent_id AND tasks.state = 'started')
               THEN CASE
                   WHEN agents.ended_at IS NULL THEN ''
                   WHEN EXISTS (SELECT 1 FROM reader_requests WHERE reader_requests.creator_id = worktree.session_agent_id AND reader_requests.completed_at IS NULL)
                       THEN 'reader'
                   WHEN EXISTS (SELECT 1 FROM processes WHERE processes.session_agent_id = worktree.session_agent_id AND processes.state IN ('running', 'background') AND processes.queued_at IS NOT NULL)
                       THEN 'place in the queue'
                   WHEN EXISTS (SELECT 1 FROM processes WHERE processes.session_agent_id = worktree.session_agent_id AND processes.state IN ('running', 'background'))
                       THEN 'command to finish'
                   ELSE 'next start'
               END
           WHEN EXISTS (SELECT 1 FROM proofs WHERE proofs.worktree_id = worktree.id AND proofs.state IN ('queued', 'running'))
               THEN 'tests'
           WHEN worktree.state = 'delivered' AND EXISTS (
               SELECT 1 FROM proofs WHERE proofs.worktree_id = worktree.id AND proofs.state = 'shown')
               THEN 'proof check'
           WHEN worktree.state = 'delivered' THEN 'merge'
           WHEN worktree.state = 'cut' AND NOT EXISTS (
               SELECT 1 FROM tasks WHERE tasks.delegated_to = worktree.session_agent_id AND tasks.state IN ('open', 'started', 'testing', 'blocked'))
               THEN 'a job'
           WHEN agents.ended_at IS NOT NULL THEN 'a job'
           ELSE ''
       END AS reason
FROM worker_worktrees AS worktree
JOIN agents ON agents.id = worktree.session_agent_id
WHERE worktree.removed_at IS NULL
  AND worktree.id = (SELECT max(latest.id) FROM worker_worktrees AS latest WHERE latest.session_agent_id = worktree.session_agent_id)
"""

WORKER_PROGRESS_SELECT = """
SELECT worktree.session_agent_id AS agent_id, worktree.environment_id, worktree.branch, worktree.task_id,
       coalesce(worktree.cut_at, worktree.created_at) AS started_at,
       worktree.removed_at AS finished_at,
       count(tasks.id) AS task_count,
       count(CASE WHEN tasks.state = 'completed' THEN 1 END) AS completed_count
FROM worker_worktrees AS worktree
LEFT JOIN tasks ON (tasks.delegated_to = worktree.session_agent_id OR tasks.holder_id = worktree.session_agent_id)
    AND (tasks.closed_at IS NULL OR tasks.closed_at >= coalesce(worktree.cut_at, worktree.created_at))
WHERE worktree.id = (SELECT max(latest.id) FROM worker_worktrees AS latest WHERE latest.session_agent_id = worktree.session_agent_id)
GROUP BY worktree.environment_id, worktree.id
"""
