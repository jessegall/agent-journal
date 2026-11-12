from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.line_typing import LineTyping
from engine.query.conditions.greater import Greater

PAUSE_SOURCE = "drivers.pause"
RESUME_SOURCE = "drivers.resume"
COMPACTED_WAKE_SOURCE = "drivers.compacted"
IDLE_MESSAGE_SOURCE = "messages.idle"
TERMINAL_SOURCES = (PAUSE_SOURCE, RESUME_SOURCE, IDLE_MESSAGE_SOURCE, "tasks.wait-ended")


class WaitingLineTyping:
    """Types a waiting line into its agent's terminal when the line wakes the agent or is of a kind typed, the
    agent sits between turns (a silent agent in a turn is never typed to), and its program's plan allowance
    is not used up; a line that is not typed stays waiting for the agent's next hook, or for the end of its
    usage limit. The same line is typed once between two hooks of the agent: a repeat is entered without
    being typed again."""

    def __init__(self, queries: Queries, typing: LineTyping, bus: Bus, hook_calls: HookCallQuery, agents: AgentRows) -> None:
        self.queries, self.typing, self.bus, self.hook_calls, self.agents = queries, typing, bus, hook_calls, agents

    def type(self, line: AgentLine, actor_id: int, timestamp: Timestamp) -> None:
        if not (line.wakes_agent or line.source in TERMINAL_SOURCES) or line.state is not AgentLineState.WAITING:
            return
        if line.source not in (PAUSE_SOURCE, RESUME_SOURCE, COMPACTED_WAKE_SOURCE) and not self.hook_calls.has_ended_turn(line.session_agent_id):
            return
        actor = Actor(actor_id, ActorType.USER)
        if self.has_entered_repeat(line):
            self.bus.run(EnterAgentLine(line.id), actor)
        else:
            self.typing.enter_line(line, actor)

    def release(self, agent_id: int, actor_id: int, timestamp: Timestamp) -> None:
        waiting = self.queries.query(AgentLine).filter(session_agent_id=agent_id, state=AgentLineState.WAITING).oldest().all_rows()
        for line in waiting:
            self.type(line, actor_id, timestamp)

    def has_entered_repeat(self, line: AgentLine) -> bool:
        if line.repeats_without_hook:
            return False
        entered_lines = self.queries.query(AgentLine).filter(session_agent_id=line.session_agent_id, source=line.source, text=line.text, state=AgentLineState.ENTERED)
        hook = self.hook_calls.newest_agent_hook(line.session_agent_id)
        return (entered_lines if hook is None else entered_lines.matching(Greater("created_at", hook.creation_timestamp().text))).exists()
