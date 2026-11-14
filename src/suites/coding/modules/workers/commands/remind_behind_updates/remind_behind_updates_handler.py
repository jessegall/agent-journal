from datetime import timedelta

from engine.actor.actor import Actor
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_nudges import STALE_SOURCE, CONFLICT_OPEN, CONFLICT_REPEATED, UPDATE_SKIPPED, UPDATE_REMINDER
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import UPDATE_REMINDERS, UPDATE_WAIT_MINUTES

CHECKS_REASON = "every behind check in that state is reminded of"
CONFLICT_LINES = (CONFLICT_OPEN, CONFLICT_REPEATED)


class RemindBehindUpdatesHandler(Handler[RemindBehindUpdates, None]):
    """Reminds a worker whose ordered update waits the set minutes since the order or its last reminder, up to
    the set number of reminders, and then tells the merger once that the worker has not run it. A paused or
    stopped worker is not reminded and its wait starts again, so the order waits until it is back; the
    worktree's owner, also after a takeover, is the one reminded. Markers an update left open past the wait go
    to the merger, first to advise the worker, then to pass it."""

    command = RemindBehindUpdates
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, settings: SettingValues, nudger: Nudger, inbox: MergerInbox, numbers: RowNumbers, git: WorktreeGit) -> None:
        self.queries, self.rows, self.repository, self.settings, self.nudger, self.inbox, self.numbers, self.git = queries, rows, repository, settings, nudger, inbox, numbers, git
        self.clashing: set[int] = set()

    def prepare(self, command: RemindBehindUpdates, actor: Actor) -> None:
        checks = tuple(self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.CONFLICTED).every_row(CHECKS_REASON))
        worktrees = self.rows.required_index(Worktree, [check.worktree_id for check in checks])
        self.clashing = {worktree.id for worktree in worktrees.values() if self.git.conflict_files(worktree)}

    def handle(self, command: RemindBehindUpdates, context: Context) -> None:
        wait = timedelta(minutes=self.settings.number(UPDATE_WAIT_MINUTES))
        limit = self.settings.number(UPDATE_REMINDERS)
        ordered = [check for check in self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.ORDERED).every_row(CHECKS_REASON) if check.reminders <= limit]
        worktrees = self.rows.required_index(Worktree, list({check.worktree_id for check in ordered}))
        workers = self.rows.required_index(Agent, list({worktree.session_agent_id for worktree in worktrees.values()}))
        for check in ordered:
            worktree = worktrees[check.worktree_id]
            worker = workers[worktree.session_agent_id]
            if worker.paused_at is not None or worker.ended_at is not None:
                self.repository.save_change(check, check.paused(), context)
            elif context.timestamp.value - check.updated_at.value >= wait:
                self.remind(check, worktree, limit, context)
        for check in self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.CONFLICTED).every_row(CHECKS_REASON):
            if check.reminders < len(CONFLICT_LINES) and context.timestamp.value - check.updated_at.value >= wait:
                self.conflict_remains(check, context)

    def conflict_remains(self, check: WorktreeBehindCheck, context: Context) -> None:
        if check.worktree_id not in self.clashing:
            return
        worktree = self.rows.required(Worktree, check.worktree_id)
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        self.inbox.send_nudge(CONFLICT_LINES[check.reminders].nudge(worker=worker), STALE_SOURCE, context)
        self.repository.save_change(check, check.reminded(), context)

    def remind(self, check: WorktreeBehindCheck, worktree: Worktree, limit: int, context: Context) -> None:
        if check.reminders < limit:
            self.nudger.send(worktree.session_agent_id, UPDATE_REMINDER, STALE_SOURCE, context, count=check.commits_lagging)
        else:
            self.inbox.send_nudge(UPDATE_SKIPPED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)), STALE_SOURCE, context)
        self.repository.save_change(check, check.reminded(), context)
