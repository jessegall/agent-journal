from collections.abc import Sequence
from dataclasses import dataclass

from core.base.provider.control_choice import ControlChoice


@dataclass(frozen=True)
class ControlGroup:
    """A thing the agent bar changes on a running program, such as its model, and the choices it offers."""

    key: str
    label: str
    choices: Sequence[ControlChoice]
