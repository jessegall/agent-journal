from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.layout_shape import LayoutShape


@dataclass(frozen=True)
class SuiteEntry:
    """A registered suite: its name, the module that ships it, the suites it requires, its viewer windows, its
    default layouts and its layout presets per page, and the windows of each of its entrances."""

    name: str
    module: str
    requires: Sequence[str]
    windows: Sequence[str]
    layouts: Mapping[str, LayoutShape]
    presets: Mapping[str, Sequence[LayoutPreset]]
    task_assigner: str = ""
    shipped: bool = False
    entry_points: Mapping[str, Sequence[str]] = field(default_factory=dict[str, Sequence[str]])
