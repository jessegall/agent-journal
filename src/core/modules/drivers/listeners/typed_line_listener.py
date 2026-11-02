from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine

PAUSE_SOURCE = "drivers.pause"
RESUME_SOURCE = "drivers.resume"
IDLE_MESSAGE_SOURCE = "messages.idle"
TERMINAL_PREFIX = "[journal] "
TERMINAL_SOURCES = (PAUSE_SOURCE, RESUME_SOURCE, IDLE_MESSAGE_SOURCE, "tasks.wait-ended")


class TypedLineListener(CommitListener):
    """Types a line for an agent that may be sitting idle and so sends no hook that could carry it: that it
    was paused or resumed, that a message waits, or that a task it waited on opened. With no terminal to type in, the
    line waits for its next hook."""

    name = "drivers.typed-line"
    event = "agent_line.create"

    def __init__(self, queries: Queries, typing: TerminalTyping, bus: Bus) -> None:
        self.queries, self.typing, self.bus = queries, typing, bus

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        if line.source not in TERMINAL_SOURCES:
            return
        try:
            self.typing.type_line(self.queries.query(Agent).find(line.agent_id).terminal_id, f"{TERMINAL_PREFIX}{line.text}")
        except Refusal:
            return
        self.bus.run(EnterAgentLine(line.id), Actor(event.actor_id, ActorType.USER), environment_id=event.environment_id)
