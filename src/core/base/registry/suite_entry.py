from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class SuiteEntry:
    """A registered suite: its name, the module that ships it, the suites it requires, its default driver per role,
    whether it takes complete control, and the other modules' overlays it includes."""

    name: str
    module: str
    requires: Sequence[str]
    defaults: Mapping[str, str]
    complete_control: bool
    included_overlays: Sequence[str]
