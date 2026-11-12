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
from suites.coding.modules.workers.support.behind_nudges import BEHIND_SOURCE, UPDATE_NOT_RUN, UPDATE_REMINDER
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import UPDATE_REMINDERS, UPDATE_WAIT_MINUTES


class RemindBehindUpdatesHandler(Handler[RemindBehindUpdates, None]):
    """Reminds a worker whose ordered update waits the set minutes since the order or its last reminder, up to the set
    number of reminders, and then tells the merger once that the worker has not run it. A paused worker is not
    reminded; it waits with the paused line."""

    command = RemindBehindUpdates
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, rows: EventRows, repository: Repository, settings: SettingValues, nudger: Nudger, inbox: MergerInbox, numbers: RowNumbers) -> None:
        self.queries, self.rows, self.repository, self.settings, self.nudger, self.inbox, self.numbers = queries, rows, repository, settings, nudger, inbox, numbers

    def handle(self, command: RemindBehindUpdates, context: Context) -> None:
        wait = timedelta(minutes=self.settings.number(UPDATE_WAIT_MINUTES))
        limit = self.settings.number(UPDATE_REMINDERS)
        for check in self.queries.query(WorktreeBehindCheck).filter(state=BehindCheckState.ORDERED).all_rows():
            if check.reminders > limit or context.timestamp.value - check.updated_at.value < wait:
                continue
            worktree = self.rows.required(Worktree, check.worktree_id)
            if self.rows.required(Agent, worktree.session_agent_id).paused_at is not None:
                continue
            self.remind(check, worktree, limit, context)

    def remind(self, check: WorktreeBehindCheck, worktree: Worktree, limit: int, context: Context) -> None:
        if check.reminders < limit:
            self.nudger.send(worktree.session_agent_id, UPDATE_REMINDER, BEHIND_SOURCE, context, count=check.behind, base=worktree.base_branch)
        else:
            self.inbox.send_nudge(UPDATE_NOT_RUN.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)), BEHIND_SOURCE, context)
        self.repository.save_change(check, check.reminded(), context)
