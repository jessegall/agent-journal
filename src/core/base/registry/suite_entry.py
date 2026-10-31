from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.layout_shape import LayoutShape


@dataclass(frozen=True)
class SuiteEntry:
    """A registered suite: its name, the module that ships it, the suites it requires, its default driver per role,
    whether it takes complete control, the other modules' overlays it includes, its viewer windows, its
    default layouts and its layout presets per page."""

    name: str
    module: str
    requires: Sequence[str]
    defaults: Mapping[str, str]
    complete_control: bool
    included_overlays: Sequence[str]
    windows: Sequence[str]
    layouts: Mapping[str, LayoutShape]
    presets: Mapping[str, Sequence[LayoutPreset]]

    def is_overlay_included(self, overlay: str) -> bool:
        return not self.complete_control or overlay in self.included_overlays

    def is_rule_included(self, owner: str, patterns: Sequence[str], driver: str) -> bool:
        if not self.complete_control or owner == driver:
            return True
        return any(pattern.partition(".")[0] in (self.name, *self.requires) for pattern in patterns)

