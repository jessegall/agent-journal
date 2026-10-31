from collections.abc import Mapping, Sequence
from typing import ClassVar

from core.base.viewer.layout_shape import LayoutShape


class Suite:
    """The base of every suite: a swappable set of drivers above the core, with the suites it requires, a default
    driver per role, whether it takes complete control, the other modules' overlays it then includes, the viewer
    windows its environments show, and the default layout of each viewer page, per driver where one is named."""

    name: ClassVar[str]
    requires: ClassVar[Sequence[str]] = []
    defaults: ClassVar[Mapping[str, str]] = {}
    complete_control: ClassVar[bool] = False
    included_overlays: ClassVar[Sequence[str]] = []
    windows: ClassVar[Sequence[str]] = []
    layouts: ClassVar[Mapping[str, LayoutShape]] = {}
