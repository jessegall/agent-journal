from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from suites.coding.modules.workers.support.behind_agent_messages import STALE_SOURCE
from suites.coding.modules.workers.agent_messages.stale_choices_message import StaleChoicesMessage
from suites.coding.modules.workers.agent_messages.merger_stale_worktree_message import MergerStaleWorktreeMessage
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class AnnounceBehindChecksHandler(Handler[AnnounceBehindChecks, tuple[AgentMessage, ...]]):
    """Leaves a line for each worktree behind its base where the merger reads it, so journal merger next lists
    them all; with the merger off the lines go to the main agent as other merger lines do, naming its choices.
    The look starts the merger once afterwards, outside this write."""

    command = AnnounceBehindChecks
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, queries: Queries, inbox: MergerInbox, settings: SettingValues) -> None:
        self.rows, self.queries, self.inbox, self.settings = rows, queries, inbox, settings

    def handle(self, command: AnnounceBehindChecks, context: Context) -> tuple[AgentMessage, ...]:
        merger_enabled = self.settings.flag(MERGER_ENABLED)
        worktrees = self.rows.required_index(Worktree, command.worktree_ids)
        agent_messages = tuple(self.agent_message(worktrees[worktree_id], MergerStaleWorktreeMessage.declared() if merger_enabled else StaleChoicesMessage.declared()) for worktree_id in command.worktree_ids)
        for agent_message in agent_messages:
            self.inbox.send_agent_message(agent_message, STALE_SOURCE, context)
        return agent_messages

    def agent_message(self, worktree: Worktree, declaration: MessageTemplate) -> AgentMessage:
        check = self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).newest().first()
        return declaration.agent_message(worker=worktree.session_agent_id, count=check.commits_lagging if check else 0)
