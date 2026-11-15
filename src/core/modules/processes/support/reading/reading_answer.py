from dataclasses import dataclass

from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class ReadingAnswer:
    """What the reading enforcer says to a shell line: the refusal of its next start, if any, and the lines that
    teach the agent to read its runs, or that come with the refusal."""

    refusal: AgentMessage | None = None
    agent_messages: tuple[AgentMessage, ...] = ()
