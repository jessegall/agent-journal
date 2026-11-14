from typing import ClassVar

from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.layout_shape import LayoutShape


class ViewerPreset:
    """One layout a suite offers in the picker of a viewer page: its key, the name and line the picker shows, and
    its shape."""

    key: ClassVar[str]
    name: ClassVar[str]
    text: ClassVar[str]
    shape: ClassVar[LayoutShape]

    @classmethod
    def layout_preset(cls) -> LayoutPreset:
        return LayoutPreset(cls.key, cls.name, cls.text, cls.shape)
