from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.created import Created
from core.base.command.context import Context


class DispatchBranchGuard(Guard[Created[Worktree]]):
    """Refuses a worktree in an environment that names no branch to cut it from."""

    name = "workers.dispatch-needs-branch"

    def __init__(self, environments: EnvironmentRows) -> None:
        self.environments = environments

    def check(self, event: Created[Worktree], context: Context) -> None:
        worktree = event.row
        environment = self.environments.find(worktree.environment_id)
        if not environment.branch:
            raise Refusal(f"environment {environment.name} has no branch", f"journal environment edit {environment.name} --branch <branch>")
