WORKER_POINTS_SELECT = (
    "SELECT worker_worktrees.id AS worktree_id, worker_worktrees.agent_id, tasks.title AS task_title, tasks.brief AS task_brief,"
    " (SELECT json_group_array(json_object('point', proofs.point, 'state', proofs.state, 'text', proofs.text, 'shortfall', proofs.shortfall))"
    " FROM proofs WHERE proofs.worktree_id = worker_worktrees.id) AS proofs"
    " FROM worker_worktrees"
    " JOIN tasks ON tasks.id = worker_worktrees.task_id"
)
