from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class LiftHold(Command[int]):
    """A user lifts every hold on an agent about reading: the silent-run hold and the blocks of its reader
    requests. It answers how many holds it lifted."""

    agent_id: int
