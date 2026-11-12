from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ApproveCheckpoint(Command[int]):
    """Lets the phases after a passed checkpoint open, which waited for a person; it gives the phase's number."""

    plan_id: int
    phase_id: int
