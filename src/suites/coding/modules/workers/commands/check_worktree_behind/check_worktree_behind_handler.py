from engine.actor.actor import Actor
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind import CheckWorktreeBehind
from suites.coding.modules.workers.models.enums.behind_route import BehindRoute
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.support.behind_checks import BehindChecks
from suites.coding.modules.workers.support.behind_nudges import BEHIND_FOR_MAIN_AGENT, FAST_FORWARDED, BEHIND_SOURCE
from suites.coding.modules.workers.support.worker_settings import UPDATE_TO_MAIN_COMMITS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class CheckWorktreeBehindHandler(Handler[CheckWorktreeBehind, BehindRoute]):
    """Counts the worktree's commits behind its base once, before the transaction opens, since git runs, and
    opens a check when it is far enough behind. A worktree with nothing of its own and no command of its
    worker running is moved onto the base at once and its worker told; one at the set number of commits goes
    to the main agent; any other waits for the merger, which the look starts once for all its checks."""

    command = CheckWorktreeBehind
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, git: WorktreeGit, checks: BehindChecks, repository: Repository, settings: SettingValues, operations: WorkerOperationQuery,
                 main_line: MainAgentLine, nudger: Nudger, numbers: RowNumbers) -> None:
        self.rows, self.git, self.checks, self.repository, self.settings, self.operations = rows, git, checks, repository, settings, operations
        self.main_line, self.nudger, self.numbers = main_line, nudger, numbers
        self.behind, self.tip, self.moved = 0, "", False

    def prepare(self, command: CheckWorktreeBehind, actor: Actor) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.tip = self.git.tip(worktree.folder, worktree.base_branch)
        self.behind = self.git.behind_tip(worktree, self.tip)
        self.moved = False
        if self.may_fast_forward(worktree):
            self.moved = self.git.fast_forward(worktree, self.tip)

    def may_fast_forward(self, worktree: Worktree) -> bool:
        is_idle = self.operations.active(worktree.session_agent_id) is None
        return self.checks.opens(worktree, self.behind) and is_idle and not self.git.has_own_work(worktree)

    def handle(self, command: CheckWorktreeBehind, context: Context) -> BehindRoute:
        worktree = self.rows.required(Worktree, command.worktree_id)
        if not self.checks.opens(worktree, self.behind):
            return BehindRoute.NONE
        check = self.repository.save(WorktreeBehindCheck.opened(worktree.id, self.tip, self.behind), context)
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        if self.moved:
            self.repository.save_change(check, check.updated(), context)
            self.repository.save_change(worktree, worktree.updated(self.tip), context)
            self.nudger.send(worktree.session_agent_id, FAST_FORWARDED, BEHIND_SOURCE, context)
            return BehindRoute.FAST_FORWARDED
        target_main = self.settings.number(UPDATE_TO_MAIN_COMMITS)
        if target_main > 0 and self.behind >= target_main:
            self.repository.save_change(check, check.passed_to_main_agent(f"{self.behind} commits behind, at least {target_main}"), context)
            self.main_line.send_nudge(BEHIND_FOR_MAIN_AGENT.nudge(worker=worker, count=self.behind), BEHIND_SOURCE, context)
            return BehindRoute.MAIN_AGENT
        return BehindRoute.MERGER
