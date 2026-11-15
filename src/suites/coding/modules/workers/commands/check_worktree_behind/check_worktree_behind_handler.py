from engine.actor.actor import Actor
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_sender import MessageSender
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
from suites.coding.modules.workers.support.behind_agent_messages import STALE_SOURCE
from suites.coding.modules.workers.agent_messages.main_agent_stale_worktree_message import MainAgentStaleWorktreeMessage
from suites.coding.modules.workers.agent_messages.fast_forwarded_message import FastForwardedMessage
from suites.coding.modules.workers.agent_messages.update_ordered_message import UpdateOrderedMessage
from suites.coding.modules.workers.support.worker_settings import FORCED_UPDATE_COMMITS, MAIN_UPDATE_COMMITS
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class CheckWorktreeBehindHandler(Handler[CheckWorktreeBehind, BehindRoute]):
    """Counts the worktree's commits behind its base once, before the transaction opens, since git runs, and
    opens a check when it is far enough behind. A worktree with nothing of its own and no command of its
    worker running is moved onto the base at once and its worker told; one at the forced number of commits
    is ordered to update at once, with no one to judge it; one at the set number goes to the main agent; any
    other waits for the merger, which the look starts once for all its checks."""

    command = CheckWorktreeBehind
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, git: WorktreeGit, checks: BehindChecks, repository: Repository, settings: SettingValues, operations: WorkerOperationQuery,
                 main_line: MainAgentLine, message_sender: MessageSender, numbers: RowNumbers) -> None:
        self.rows, self.git, self.checks, self.repository, self.settings, self.operations = rows, git, checks, repository, settings, operations
        self.main_line, self.message_sender, self.numbers = main_line, message_sender, numbers
        self.behind, self.tip, self.moved = 0, "", False

    def prepare(self, command: CheckWorktreeBehind, actor: Actor) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.tip = self.git.tip(worktree.folder, worktree.base_branch)
        self.behind = self.git.tip_lag_count(worktree, self.tip)
        self.moved = False
        if self.may_fast_forward(worktree):
            self.moved = self.git.fast_forward(worktree, self.tip)

    def may_fast_forward(self, worktree: Worktree) -> bool:
        is_idle = self.operations.active(worktree.session_agent_id) is None
        return self.checks.opens(worktree, self.behind) and is_idle and not self.git.has_worker_work(worktree)

    def handle(self, command: CheckWorktreeBehind, context: Context) -> BehindRoute:
        worktree = self.rows.required(Worktree, command.worktree_id)
        if not self.checks.opens(worktree, self.behind):
            return BehindRoute.NONE
        check = self.repository.save(WorktreeBehindCheck.opened(worktree.id, self.tip, self.behind), context)
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        if self.moved:
            self.repository.save_change(check, check.updated(), context)
            self.repository.save_change(worktree, worktree.updated(self.tip), context)
            self.message_sender.send(worktree.session_agent_id, FastForwardedMessage.declared(), STALE_SOURCE, context)
            return BehindRoute.FAST_FORWARDED
        forced = self.settings.number(FORCED_UPDATE_COMMITS)
        if forced > 0 and self.behind >= forced:
            self.repository.save_change(check, check.ordered(context.actor.id, f"{self.behind} commits behind, at least {forced}"), context)
            self.message_sender.send(worktree.session_agent_id, UpdateOrderedMessage.declared(), STALE_SOURCE, context, count=self.behind)
            return BehindRoute.UPDATE_ORDERED
        target_main = self.settings.number(MAIN_UPDATE_COMMITS)
        if target_main > 0 and self.behind >= target_main:
            self.repository.save_change(check, check.escalated(f"{self.behind} commits behind, at least {target_main}"), context)
            self.main_line.send_agent_message(MainAgentStaleWorktreeMessage.declared().agent_message(worker=worker, count=self.behind), STALE_SOURCE, context)
            return BehindRoute.MAIN_AGENT
        return BehindRoute.MERGER
