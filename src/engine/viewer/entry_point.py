from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.viewer.preset_set import PresetSet
from engine.viewer.viewer_layout import ViewerLayout
from engine.viewer.window import Window


class EntryPoint:
    """One way into a suite's viewer: its key, the windows it offers (each a window class, or a name until
    the window is one), the default layout of each page and the presets each page offers. A second way in
    is a second class beside the first."""

    key: ClassVar[str]
    windows: ClassVar[Sequence[type[Window] | str]] = []
    layouts: ClassVar[Mapping[str, type[ViewerLayout]]] = {}
    presets: ClassVar[Mapping[str, type[PresetSet]]] = {}

    # a window not yet written as a class is listed by its name
    @classmethod
    def window_names(cls) -> tuple[str, ...]:
        return tuple(window if isinstance(window, str) else window.name for window in cls.windows)
