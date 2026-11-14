from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from suites.coding.modules.workers.support.checkpoint_folders import FOLDER_NAME
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class PlanTestFolderListener(CommitListener[Moved[Plan]]):
    """A plan that is completed or cancelled has no more checkpoint runs, so the checkout its runs tested
    in is removed."""

    name = "workers.plan-test-folder"
    moves = [PlanLifecycle.close, PlanLifecycle.cancel]

    def __init__(self, git: WorktreeGit, environments: EnvironmentRows) -> None:
        self.git, self.environments = git, environments

    def handle(self, event: Moved[Plan], logged: LoggedEvent) -> None:
        self.git.remove_base_checkout(self.environments.find(event.row.environment_id), FOLDER_NAME.format(plan=event.row.id))
