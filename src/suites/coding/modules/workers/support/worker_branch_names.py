from dataclasses import dataclass


@dataclass(frozen=True)
class WorkerBranchNames:
    """Names the branch of each worktree one worker gets over time: the first has the worker's own branch name,
    and each later one that name with its position, such as journal/main/worker-5-2 for the second."""

    first_branch: str

    def branch(self, position: int) -> str:
        return self.first_branch if position == 1 else f"{self.first_branch}-{position}"
