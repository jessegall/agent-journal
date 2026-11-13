from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class WorktreeStaleCheckTime(EnvironmentScoped, Model):
    """When the worktrees of an environment were last looked at for how far they are behind their base branch, so a
    restart waits for the next look instead of looking at every worktree at once."""

    model_name = "worktree_behind_look"
    cli_name = "behind-look"

    environment_id: int = 0
    checked_at: Timestamp
