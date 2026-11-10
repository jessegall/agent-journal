from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class FocusPlan(Command[tuple[str, ...]]):
    """Reads the plan focus of the asking agent, and first names a plan as its focus or clears the plan it
    named. A person does this for the running main agent."""

    plan_id: int | None = None
    clears: bool = False
