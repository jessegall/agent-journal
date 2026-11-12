from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_nudges import BEHIND_FOR_MERGER, BEHIND_SOURCE
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class AnnounceBehindChecksHandler(Handler[AnnounceBehindChecks, None]):
    """Leaves a line for each worktree behind its base where the merger reads it, so journal merger next lists them
    all, and starts the merger once; with the merger off the lines go to the main agent as other merger lines do."""

    command = AnnounceBehindChecks
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, queries: Queries, inbox: MergerInbox, settings: SettingValues, bus: Bus, numbers: RowNumbers) -> None:
        self.rows, self.queries, self.inbox, self.settings, self.bus, self.numbers = rows, queries, inbox, settings, bus, numbers

    def handle(self, command: AnnounceBehindChecks, context: Context) -> None:
        nudges = [self.nudge(self.rows.required(Worktree, worktree_id)) for worktree_id in command.worktree_ids]
        for nudge in nudges:
            self.inbox.send_nudge(nudge, BEHIND_SOURCE, context)
        if nudges and self.settings.flag(MERGER_ENABLED):
            self.bus.dispatch(StartMerger(nudges[0], context.timestamp), context)

    def nudge(self, worktree: Worktree):
        check = self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).newest().first()
        return BEHIND_FOR_MERGER.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), count=check.behind if check else 0, base=worktree.base_branch)
