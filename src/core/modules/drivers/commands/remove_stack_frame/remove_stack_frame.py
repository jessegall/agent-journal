from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveStackFrame(Command[str]):
    """A person's removal of one frame from an agent's stack, with the reason (doc 1310 section 4.3)."""

    agent_id: int
    frame: str
    reason: str
