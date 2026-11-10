from engine.database.migration import Migration


class ProofProcessWorkMigration(Migration):
    """Records the worker and task on existing proof processes."""

    number = 7
    statements = ["""
        UPDATE processes SET
            owner_agent_id = (SELECT worker_worktrees.agent_id FROM proofs JOIN worker_worktrees
                         ON worker_worktrees.id = proofs.worktree_id WHERE proofs.process_id = processes.id LIMIT 1),
            task_id = (SELECT proofs.task_id FROM proofs WHERE proofs.process_id = processes.id LIMIT 1)
        WHERE EXISTS (SELECT 1 FROM proofs WHERE proofs.process_id = processes.id)
    """]
