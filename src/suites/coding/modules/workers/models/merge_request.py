from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MergeRequest(EnvironmentScoped, Model):
    """A worker's merge about to happen, saved before git merges anything, so a plugin's guard on its creation can
    judge the range from the target branch's tip to the worker's tip and refuse it with nothing changed."""

    model_name = "merge_request"
    cli_name = "merge-request"

    environment_id: int = 0
    worktree_id: int
    worker_id: int
    creator_id: int
    target_branch: str
    target_commit: str
    branch: str
    branch_commit: str
    folder: str
