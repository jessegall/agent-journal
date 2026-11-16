from dataclasses import dataclass
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class GraphifyAnswer:
    """What a search of the code that does not use Graphify gets: a refusal past the block count, or a line from the
    agent message count on."""

    refusal: AgentMessage | None = None
    agent_message: AgentMessage | None = None
