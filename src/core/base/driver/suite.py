from collections.abc import Mapping, Sequence
from typing import ClassVar


class Suite:
    """The base of every suite: a swappable set of drivers above the core, with the suites it requires, the driver it
    gives each role by default, whether it takes complete control, and the other modules' overlays it then keeps."""

    name: ClassVar[str]
    requires: ClassVar[Sequence[str]] = []
    defaults: ClassVar[Mapping[str, str]] = {}
    complete_control: ClassVar[bool] = False
    kept_overlays: ClassVar[Sequence[str]] = []
