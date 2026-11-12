from engine.actor.actor import Actor
from engine.container.container import Container
from engine.driver.program_lockdown import ProgramLockdown
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.command.bus import Bus
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.return_unhandled_merger_lines.return_unhandled_merger_lines import ReturnUnhandledMergerLines
from suites.coding.modules.workers.commands.close_taken_in_worktree.close_taken_in_worktree import CloseTakenInWorktree
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.merger_visit import MergerVisit
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE, MERGER_PROFILE
from suites.coding.modules.workers.support.merge_ready_lines import MergeReadyLines
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class MergerRetry:
    """Wakes an idle merger when the next worker can be merged or a line waits unread for it. A merger whose
    program is at a usage limit is left alone until the limit ends. A worker whose branch has no commit ahead of
    its base is closed as merged without the merger."""

    def __call__(self, container: Container) -> None:
        worktrees = container.get(WorktreeQuery).all_worktrees()
        environments = tuple(dict.fromkeys(row.environment_id for row in worktrees if row.is_merge_ready))
        for environment_id in environments:
            worktree = next(row for row in worktrees if row.environment_id == environment_id and row.is_merge_ready)
            with container.get(Scopes).row_scope(worktree):
                self.retry(container, worktree)
        self.return_unhandled_lines(container)
        unread = container.get(Queries).query(MergerLine).matching(IsNull("read_at")).matching(IsNull("read_output_id")).matching(IsNull("outcome")).oldest().all_rows()
        for line in dict((row.environment_id, row) for row in reversed(tuple(unread))).values():
            with container.get(Scopes).row_scope(line):
                self.retry_line(container, line)

    def return_unhandled_lines(self, container: Container) -> None:
        open_visits = container.get(Queries).query(MergerVisit).matching(IsNull("closed_at")).all_rows()
        for visit in dict((row.environment_id, row) for row in open_visits).values():
            with container.get(Scopes).row_scope(visit):
                if self.is_merger_idle(container):
                    container.get(Bus).run(ReturnUnhandledMergerLines(), Actor.core(), environment_id=visit.environment_id)

    def retry_line(self, container: Container, line: MergerLine) -> None:
        if not self.is_merger_idle(container):
            return
        container.get(Bus).run(StartMerger(MERGER_LINE_AVAILABLE.nudge(line=line.id), line.creation_timestamp()), Actor.core(), environment_id=line.environment_id)

    @staticmethod
    def is_merger_idle(container: Container) -> bool:
        if not container.get(SettingValues).flag(MERGER_ENABLED):
            return False
        merger = container.get(Queries).query(Agent).filter(profile=MERGER_PROFILE).matching(IsNull("retired_at")).newest().first()
        if merger is None:
            return not MergerRetry.is_profile_program_locked_down(container)
        if container.get(ProgramLockdown).lockdown(merger.program).is_active:
            return False
        return merger.ended_at is not None and container.get(HelperJobRows).open_job(merger.id) is None

    @staticmethod
    def is_profile_program_locked_down(container: Container) -> bool:
        main_agent = container.get(AgentRows).main_agent()
        program = container.get(ProfileFiles).effective(MERGER_PROFILE).program or (main_agent.program if main_agent is not None else "")
        return bool(program) and container.get(ProgramLockdown).lockdown(program).is_active

    def retry(self, container: Container, worktree: Worktree) -> None:
        if container.get(SettingValues).flag(MERGER_ENABLED) and container.get(Bus).run(CloseTakenInWorktree(worktree.id), Actor.core(), environment_id=worktree.environment_id):
            return
        if not self.is_merger_idle(container):
            return
        environment = container.get(EnvironmentRows).find(worktree.environment_id)
        git = container.get(WorktreeGit)
        if environment.branch != worktree.base_branch or git.head(environment.folder) != worktree.base_branch:
            return
        if git.uncommitted_overlap(environment.folder, worktree):
            return
        line = container.get(MergeReadyLines).nudge(worktree).text
        container.get(Bus).run(StartMerger(line, worktree.merge_ready_at), Actor.core(), environment_id=worktree.environment_id)
