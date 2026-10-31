from dataclasses import dataclass

from core.base.viewer.layout_shape import LayoutShape


@dataclass(frozen=True)
class LayoutPreset:
    """A layout a suite offers for one viewer page: its key, the name and line the picker shows, and its shape."""

    key: str
    name: str
    text: str
    shape: LayoutShape
