from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.viewer.preset_set import PresetSet
from engine.viewer.viewer_layout import ViewerLayout


class Entrance:
    """One way into a suite's viewer: its key, the windows it offers, the default layout of each page and the
    presets each page offers. A second way in is a second class beside the first."""

    key: ClassVar[str]
    windows: ClassVar[Sequence[str]] = []
    layouts: ClassVar[Mapping[str, type[ViewerLayout]]] = {}
    presets: ClassVar[Mapping[str, type[PresetSet]]] = {}
