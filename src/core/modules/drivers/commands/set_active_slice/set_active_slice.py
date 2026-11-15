from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SetActiveSlice(Command[tuple[str, ...]]):
    """A person switches one part of the new driver on or off in this environment."""

    slice_name: str
    is_active: bool
