from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.modules.workers.support.behind_nudges import STALE_CHOICES, MERGER_STALE_WORKTREE, STALE_SOURCE
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class AnnounceBehindChecksHandler(Handler[AnnounceBehindChecks, tuple[Nudge, ...]]):
    """Leaves a line for each worktree behind its base where the merger reads it, so journal merger next lists
    them all; with the merger off the lines go to the main agent as other merger lines do, naming its choices.
    The look starts the merger once afterwards, outside this write."""

    command = AnnounceBehindChecks
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, queries: Queries, inbox: MergerInbox, settings: SettingValues, numbers: RowNumbers) -> None:
        self.rows, self.queries, self.inbox, self.settings, self.numbers = rows, queries, inbox, settings, numbers

    def handle(self, command: AnnounceBehindChecks, context: Context) -> tuple[Nudge, ...]:
        merger_on = self.settings.flag(MERGER_ENABLED)
        worktrees = self.rows.required_index(Worktree, command.worktree_ids)
        nudges = tuple(self.nudge(worktrees[worktree_id], MERGER_STALE_WORKTREE if merger_on else STALE_CHOICES) for worktree_id in command.worktree_ids)
        for nudge in nudges:
            self.inbox.send_nudge(nudge, STALE_SOURCE, context)
        return nudges

    def nudge(self, worktree: Worktree, declaration: NudgeDeclaration) -> Nudge:
        check = self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).newest().first()
        return declaration.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), count=check.behind if check else 0)
