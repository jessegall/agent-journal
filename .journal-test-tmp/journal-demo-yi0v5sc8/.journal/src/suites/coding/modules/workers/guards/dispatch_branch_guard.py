from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.created import Created
from core.base.command.context import Context


class DispatchBranchGuard(Guard[Created[Worktree]]):
    """Refuses a worktree in an environment that names no branch to cut it from."""

    name = "workers.dispatch-needs-branch"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[Worktree], context: Context) -> None:
        worktree = event.row
        environment = self.queries.query(Environment).find(worktree.environment_id)
        if not environment.branch:
            raise Refusal(f"environment {environment.name} has no branch", f"journal environment edit {environment.name} --branch <branch>")
