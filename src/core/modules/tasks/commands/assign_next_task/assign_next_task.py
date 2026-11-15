from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AssignNextTask(Command[None]):
    """Starts a main agent's next task in a write of its own, reading again there which tasks it holds, so two
    entry points at once hand it one task (doc 1310 section 4.11). It is run as that agent."""

    agent_id: int
