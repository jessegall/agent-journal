from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.models.worktree import Worktree


class DispatchBranchGuard(Guard):
    """Refuses a worktree in an environment that names no branch to cut it from."""

    name = "workers.dispatch-needs-branch"
    event = "worker_worktree.create"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        worktree = change.row
        if not isinstance(worktree, Worktree):
            return
        environment = self.queries.query(Environment).find(worktree.environment_id)
        if not environment.branch:
            raise Refusal(f"environment {environment.name} has no branch", f"journal environment edit {environment.name} --branch <branch>")
