WORKER_POINTS_SELECT = (
    "SELECT worker_worktrees.id AS worktree_id, worker_worktrees.agent_id, tasks.title AS task_title, tasks.brief AS task_brief,"
    " (SELECT json_group_array(json_object('point', proofs.point, 'state', proofs.state, 'text', proofs.text, 'shortfall', proofs.shortfall))"
    " FROM proofs WHERE proofs.worktree_id = worker_worktrees.id AND proofs.task_id = worker_worktrees.task_id) AS proofs"
    " FROM worker_worktrees"
    " JOIN tasks ON tasks.id = worker_worktrees.task_id"
)

WORKER_WAITS_SELECT = """
SELECT worktree.agent_id, worktree.environment_id,
       CASE
           WHEN EXISTS (SELECT 1 FROM tasks WHERE tasks.holder_id = worktree.agent_id AND tasks.state = 'started')
               THEN CASE WHEN agents.ended_at IS NOT NULL THEN 'a job' ELSE '' END
           WHEN EXISTS (SELECT 1 FROM proofs WHERE proofs.worktree_id = worktree.id AND proofs.state IN ('queued', 'running'))
               THEN 'tests'
           WHEN worktree.state = 'delivered' AND EXISTS (
               SELECT 1 FROM proofs WHERE proofs.worktree_id = worktree.id AND proofs.state = 'shown')
               THEN 'proof check'
           WHEN worktree.state = 'delivered' THEN 'merge'
           WHEN worktree.state = 'cut' AND NOT EXISTS (
               SELECT 1 FROM tasks WHERE tasks.delegated_to = worktree.agent_id AND tasks.state IN ('open', 'started', 'testing', 'blocked'))
               THEN 'a job'
           WHEN agents.ended_at IS NOT NULL THEN 'a job'
           ELSE ''
       END AS reason
FROM worker_worktrees AS worktree
JOIN agents ON agents.id = worktree.agent_id
WHERE worktree.removed_at IS NULL
  AND worktree.id = (SELECT max(latest.id) FROM worker_worktrees AS latest WHERE latest.agent_id = worktree.agent_id)
"""
