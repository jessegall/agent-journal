from core.modules.plans.models.checkpoint_reach import CheckpointReach


class CheckpointBranchMoves:
    """Answers whether the branch moved after the commit an agent's run of a checkpoint tested, so the plan's last
    window runs once more on the branch. With no suite to ask, the branch is taken to have moved."""

    def moved_after(self, reach: CheckpointReach) -> bool:
        return True
