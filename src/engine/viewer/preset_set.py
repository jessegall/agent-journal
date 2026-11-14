from collections.abc import Sequence
from typing import ClassVar

from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.viewer_preset import ViewerPreset


class PresetSet:
    """The presets a suite offers for one viewer page, in the order the picker shows them."""

    presets: ClassVar[Sequence[type[ViewerPreset]]] = []

    @classmethod
    def layout_presets(cls) -> tuple[LayoutPreset, ...]:
        return tuple(preset.layout_preset() for preset in cls.presets)
