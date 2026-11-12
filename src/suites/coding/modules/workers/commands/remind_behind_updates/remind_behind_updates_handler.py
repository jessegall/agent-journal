from datetime import timedelta

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
from suites.coding.modules.workers.support.behind_nudges import BEHIND_SOURCE, CLASH_OPEN, CLASH_STILL_OPEN, UPDATE_NOT_RUN, UPDATE_REMINDER
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import UPDATE_REMINDERS, UPDATE_WAIT_MINUTES

CLASH_LINES = (CLASH_OPEN, CLASH_STILL_OPEN)


class RemindBehindUpdatesHandler(Handler[RemindBehindUpdates, None]):
    """Reminds a worker whose ordered update waits the set minutes since the order or its last reminder, up to the set
    number of reminders, and then tells the merger once that the worker has not run it. A paused or stopped worker is not
    reminded and its wait starts again, so the order waits until it is back; the worktree's owner, also after a
    takeover, is the one reminded. Markers an update left open past the wait go to the merger, first to
    advise the worker, then to pass it."""

    command = RemindBehindUpdates
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, settings: SettingValues, nudger: Nudger, inbox: MergerInbox, numbers: RowNumbers, git: WorktreeGit) -> None:
        self.queries, self.rows, self.repository, self.settings, self.nudger, self.inbox, self.numbers, self.git = queries, rows, repository, settings, nudger, inbox, numbers, git

    def handle(self, command: RemindBehindUpdates, context: Context) -> None:
        wait = timedelta(minutes=self.settings.number(UPDATE_WAIT_MINUTES))
        limit = self.settings.number(UPDATE_REMINDERS)
        for check in self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.ORDERED).all_rows():
            if check.reminders > limit:
                continue
            worktree = self.rows.required(Worktree, check.worktree_id)
            worker = self.rows.required(Agent, worktree.session_agent_id)
            if worker.paused_at is not None or worker.ended_at is not None:
                self.repository.save_change(check, check.held(), context)
            elif context.timestamp.value - check.updated_at.value >= wait:
                self.remind(check, worktree, limit, context)
        for check in self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.CONFLICTED).all_rows():
            if check.reminders < len(CLASH_LINES) and context.timestamp.value - check.updated_at.value >= wait:
                self.clash_still_open(check, context)

    def clash_still_open(self, check: WorktreeBehindCheck, context: Context) -> None:
        """Tells the merger of markers an update left open past the wait: first to advise the worker once, then, when
        they are still open after another wait, to pass it to the main agent."""
        worktree = self.rows.required(Worktree, check.worktree_id)
        if not self.git.conflict_files(worktree):
            return
        worker = self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)
        self.inbox.send_nudge(CLASH_LINES[check.reminders].nudge(worker=worker), BEHIND_SOURCE, context)
        self.repository.save_change(check, check.reminded(), context)

    def remind(self, check: WorktreeBehindCheck, worktree: Worktree, limit: int, context: Context) -> None:
        if check.reminders < limit:
            self.nudger.send(worktree.session_agent_id, UPDATE_REMINDER, BEHIND_SOURCE, context, count=check.behind)
        else:
            self.inbox.send_nudge(UPDATE_NOT_RUN.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)), BEHIND_SOURCE, context)
        self.repository.save_change(check, check.reminded(), context)
