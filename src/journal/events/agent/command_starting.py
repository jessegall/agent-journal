from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class CommandStarting(AgentEvent):
    """One command of the shell line the agent is about to run, as the journal cut the chain: told to the plugins that hear it, one event per part, and held by a plugin inside its window; a journal command is never one, and it never goes on the bus."""

    text: str = ""
    writes: bool = False
    files: tuple[str, ...] = ()
    position: int = 0
    parts: int = 0
