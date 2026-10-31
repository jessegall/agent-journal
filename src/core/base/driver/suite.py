from collections.abc import Mapping, Sequence
from typing import ClassVar


class Suite:
    """The base of every suite: a swappable set of drivers above the core, with the suites it requires, a default
    driver per role, whether it takes complete control, and the other modules' overlays it then includes."""

    name: ClassVar[str]
    requires: ClassVar[Sequence[str]] = []
    defaults: ClassVar[Mapping[str, str]] = {}
    complete_control: ClassVar[bool] = False
    included_overlays: ClassVar[Sequence[str]] = []
