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

RESUME_SOURCE = "drivers.resume"


class ResumeLineListener(CommitListener):
    """Types the line that a resumed agent may carry on, since a paused agent sends no hook that could carry it; with no terminal to type in, the line waits for its next hook."""

    name = "drivers.resume-line"
    event = "agent_line.create"

    def __init__(self, queries: Queries, typing: TerminalTyping, bus: Bus) -> None:
        self.queries, self.typing, self.bus = queries, typing, bus

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        if line.source != RESUME_SOURCE:
            return
        try:
            self.typing.type_line(self.queries.query(Agent).find(line.agent_id).terminal_id, line.text)
        except Refusal:
            return
        self.bus.run(EnterAgentLine(line.id), Actor(event.actor_id, ActorType.USER), environment_id=event.environment_id)
