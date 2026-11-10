from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery

TERMINAL_PREFIX = "[journal] "


class LineTyping:
    """Types a waiting line into its agent's terminal. The line is claimed first, so a hook during the typing
    cannot give it too; a line that could not be typed, for any reason, waits again for the next hook, and so
    does a line for an agent that is compacting."""

    def __init__(self, agents: AgentRows, typing: TerminalTyping, bus: Bus, hook_calls: HookCallQuery, clock: Clock) -> None:
        self.agents, self.typing, self.bus, self.hook_calls, self.clock = agents, typing, bus, hook_calls, clock

    def enter_line(self, line: AgentLine, actor: Actor) -> bool:
        if self.hook_calls.is_compacting(line.session_agent_id, self.clock.timestamp()):
            return False
        try:
            self.bus.run(ClaimAgentLine(line.id), actor)
        except Refusal:
            return False
        try:
            self.typing.type_line(self.agents.find(line.session_agent_id), f"{TERMINAL_PREFIX}{line.nudge.text}")
        except Exception as error:
            self.bus.run(ReleaseAgentLine(line.id), actor)
            if isinstance(error, Refusal):
                return False
            raise
        self.bus.run(EnterAgentLine(line.id), actor)
        return True
