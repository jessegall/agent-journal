from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class WorktreeReach(Model):
    """Links a worker run of a checkpoint to the worktree and the commit it tests."""

    model_name = "worktree_reach"
    cli_name = "worktree-reach"
    shared_rows = True

    reach_id: int
    worktree_id: int
    phase_id: int
    commit_id: str
