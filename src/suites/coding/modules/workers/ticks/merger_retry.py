from core.base.actor import Actor
from core.base.container import Container
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.base.command.bus import Bus
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge_handler import ReadNextMergeHandler
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_PASSED
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class MergerRetry:
    """Wakes an idle merger when the next worker can be merged."""

    def __call__(self, container: Container) -> None:
        worktrees = container.get(WorktreeQuery).all_worktrees()
        environments = tuple(dict.fromkeys(row.environment_id for row in worktrees if ReadNextMergeHandler.waits(row)))
        for environment_id in environments:
            worktree = next(row for row in worktrees if row.environment_id == environment_id and ReadNextMergeHandler.waits(row))
            with container.get(Scopes).row_scope(worktree):
                self.retry(container, worktree)

    def retry(self, container: Container, worktree: Worktree) -> None:
        if not container.get(SettingValues).flag(MERGER_ENABLED):
            return
        merger = container.get(Queries).query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        if merger is not None and (merger.ended_at is None or container.get(HelperJobRows).open_job(merger.id) is not None):
            return
        environment = container.get(EnvironmentRows).find(worktree.environment_id)
        git = container.get(WorktreeGit)
        if environment.branch != worktree.base_branch or git.head(environment.folder) != worktree.base_branch:
            return
        if git.uncommitted_overlap(environment.folder, worktree):
            return
        line = WORKER_TESTS_PASSED.nudge(worker=worktree.session_agent_id).text
        container.get(Bus).run(StartMerger(line), Actor.core(), environment_id=worktree.environment_id)
