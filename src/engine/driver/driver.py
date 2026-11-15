from collections.abc import Sequence
from typing import ClassVar, Never

from engine.guard.guard import Guard


class Driver:
    """The base of every driver: how the journal drives an agent of one role in one suite, by the guards for
    its agents only and its opening lines."""

    name: ClassVar[str]
    suite_name: ClassVar[str]
    role: ClassVar[str]
    guards: ClassVar[Sequence[type[Guard[Never]]]] = []
    opening_lines: ClassVar[Sequence[str]] = []
