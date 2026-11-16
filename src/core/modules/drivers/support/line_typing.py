from engine.actor.actor import Actor
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.queries.hook_call_query import HookCallQuery

TERMINAL_PREFIX = "[journal] "
COPIES_REASON = "the waiting lines of one agent with one text, a handful"


class LineTyping:
    """Types a waiting line into its agent's terminal. The line and its waiting copies of the same text are
    claimed first, so a hook during the typing cannot give them too, and one typing enters them all; a line
    that could not be typed, for any reason, waits again for the next hook, and so does a line for an agent
    that is compacting."""

    def __init__(self, agents: AgentRows, typing: TerminalTyping, bus: Bus, hook_calls: HookCallQuery, clock: Clock, queries: Queries) -> None:
        self.agents, self.typing, self.bus, self.hook_calls, self.clock = agents, typing, bus, hook_calls, clock
        self.queries = queries

    def enter_line(self, line: AgentLine, actor: Actor) -> bool:
        if self.hook_calls.is_compacting(line.session_agent_id, self.clock.timestamp()):
            return False
        try:
            self.bus.run(ClaimAgentLine(line.id), actor)
        except Refusal:
            return False
        copies = self.claimed_copies(line, actor)
        try:
            self.typing.type_line(self.agents.find(line.session_agent_id), f"{TERMINAL_PREFIX}{line.agent_message.text}")
        except Exception as error:
            for claimed in (line, *copies):
                self.bus.run(ReleaseAgentLine(claimed.id), actor)
            if isinstance(error, Refusal):
                return False
            raise
        for claimed in (line, *copies):
            self.bus.run(EnterAgentLine(claimed.id), actor)
        return True

    def claimed_copies(self, line: AgentLine, actor: Actor) -> list[AgentLine]:
        copies = self.queries.query(AgentLine).filter(session_agent_id=line.session_agent_id, text=line.text, state=AgentLineState.WAITING).every_row(COPIES_REASON)
        claimed: list[AgentLine] = []
        for copy in copies:
            if copy.id == line.id:
                continue
            try:
                self.bus.run(ClaimAgentLine(copy.id), actor)
            except Refusal:
                continue
            claimed.append(copy)
        return claimed
