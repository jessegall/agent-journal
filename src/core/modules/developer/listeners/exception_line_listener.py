from core.base.actor import Actor
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.chat.models.journal_exception import JournalException
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.support.developer_settings import EXCEPTION_LINES_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class ExceptionLineListener(CommitListener[Created[JournalException]]):
    """With the setting on, an exception that shows in the chat reaches the running main agent, once per text."""

    name = "developer.exception-line"
    disabled_scopes = [ActorScope]

    def __init__(self, settings: SettingValues, agents: AgentRows, bus: Bus) -> None:
        self.settings, self.agents, self.bus = settings, agents, bus
        self.told_messages: set[str] = set()

    def handle(self, event: Created[JournalException], logged: LoggedEvent) -> None:
        main_agent = self.agents.main_agent()
        if main_agent is None or event.row.message in self.told_messages or not self.settings.flag(EXCEPTION_LINES_SETTING):
            return
        self.told_messages.add(event.row.message)
        command = SendExceptionLine(main_agent.id, event.row.id)
        self.bus.run(command, Actor.core(), cause_id=logged.id, environment_id=main_agent.environment_id)
