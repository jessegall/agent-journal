from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine

TERMINAL_PREFIX = "[journal] "


class LineTyping:
    """Types a waiting line into its agent's terminal. The line is claimed first, so a hook during the typing cannot
    give it too; a line that could not be typed, for any reason, waits again for the next hook."""

    def __init__(self, queries: Queries, typing: TerminalTyping, bus: Bus) -> None:
        self.queries, self.typing, self.bus = queries, typing, bus

    def type_line(self, line: AgentLine, actor: Actor, environment_id: int | None) -> bool:
        try:
            self.bus.run(ClaimAgentLine(line.id), actor, environment_id=environment_id)
        except Refusal:
            return False
        try:
            self.typing.type_line(self.queries.query(Agent).find(line.agent_id).terminal_id, f"{TERMINAL_PREFIX}{line.text}")
        except Exception as error:
            self.bus.run(ReleaseAgentLine(line.id), actor, environment_id=environment_id)
            if isinstance(error, Refusal):
                return False
            raise
        self.bus.run(EnterAgentLine(line.id), actor, environment_id=environment_id)
        return True
