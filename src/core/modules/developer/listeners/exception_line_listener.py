from engine.actor.actor import Actor
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.log.exception_sink import CLOCK_TICK_SOURCE
from engine.listener.commit.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.chat.models.journal_exception import JournalException
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.support.developer_settings import EXCEPTION_LINES_SETTING
from engine.setting.setting_values import SettingValues


MOST_TOLD_MESSAGES = 1000


class ExceptionLineListener(CommitListener[Created[JournalException]]):
    """Sends exception lines to the main agent, repeating tick warnings as they arrive. It remembers the newest
    messages it sent, so one is not sent twice, and forgets the oldest past a limit."""

    name = "developer.exception-line"
    disabled_scopes = [ActorScope]

    def __init__(self, settings: SettingValues, agents: AgentRows, bus: Bus) -> None:
        self.settings, self.agents, self.bus = settings, agents, bus
        self.told_messages: dict[str, None] = {}

    def handle(self, event: Created[JournalException], logged: LoggedEvent) -> None:
        main_agent = self.agents.main_agent()
        if main_agent is None or (event.row.source != CLOCK_TICK_SOURCE and event.row.message in self.told_messages) or not self.settings.flag(EXCEPTION_LINES_SETTING):
            return
        if event.row.source != CLOCK_TICK_SOURCE:
            self.told_messages[event.row.message] = None
            if len(self.told_messages) > MOST_TOLD_MESSAGES:
                del self.told_messages[next(iter(self.told_messages))]
        command = SendExceptionLine(main_agent.id, event.row.id)
        self.bus.run(command, Actor.core(), cause_id=logged.id, environment_id=main_agent.environment_id)
