from collections.abc import Sequence
from typing import Protocol

from engine.enums.command_category import CommandCategory
from core.modules.processes.support.part_spec import PartSpec


class RunStart(Protocol):
    """What the start of a run tells of it for its class to be chosen: its line, category and parts, its plugin's
    kind and the sort of run it is."""

    @property
    def line(self) -> str: ...

    @property
    def category(self) -> CommandCategory: ...

    @property
    def parts(self) -> Sequence[PartSpec]: ...

    @property
    def plugin(self) -> str: ...

    @property
    def run_name(self) -> str: ...

    @property
    def is_journal_merge(self) -> bool: ...

    @property
    def reaches_full_suite(self) -> bool: ...

    @property
    def is_graphify(self) -> bool: ...
