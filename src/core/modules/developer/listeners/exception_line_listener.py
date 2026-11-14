from engine.actor.actor import Actor
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.container.round_state import RoundState
from engine.log.exception_sink import CLOCK_TICK_SOURCE
from engine.listener.commit.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.chat.models.journal_exception import JournalException
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.support.developer_settings import EXCEPTION_LINES_SETTING
from core.modules.developer.support.recent_messages import RecentMessages
from engine.setting.setting_values import SettingValues


class ExceptionLineListener(CommitListener[Created[JournalException]], RoundState):
    """Sends exception lines to the main agent, repeating tick warnings as they arrive; any other message goes once,
    while it is among the newest of its round."""

    name = "developer.exception-line"
    disabled_scopes = [ActorScope]

    def __init__(self, settings: SettingValues, agents: AgentRows, bus: Bus) -> None:
        self.settings, self.agents, self.bus = settings, agents, bus
        self.recent_messages = RecentMessages()

    def reset(self) -> None:
        self.recent_messages = RecentMessages()

    def handle(self, event: Created[JournalException], logged: LoggedEvent) -> None:
        main_agent = self.agents.main_agent()
        if main_agent is None or (event.row.source != CLOCK_TICK_SOURCE and self.recent_messages.contains(event.row.message)) or not self.settings.flag(EXCEPTION_LINES_SETTING):
            return
        if event.row.source != CLOCK_TICK_SOURCE:
            self.recent_messages.remember(event.row.message)
        command = SendExceptionLine(main_agent.id, event.row.id)
        self.bus.run(command, Actor.core(), cause_id=logged.id, environment_id=main_agent.environment_id)
