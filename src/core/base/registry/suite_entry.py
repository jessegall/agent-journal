from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class SuiteEntry:
    """A registered suite: its name, the module that ships it, the suites it requires, its default driver per role,
    whether it takes complete control, and the other modules' overlays it includes."""

    name: str
    module: str
    requires: Sequence[str]
    defaults: Mapping[str, str]
    complete_control: bool
    included_overlays: Sequence[str]

    def is_overlay_included(self, overlay: str) -> bool:
        return not self.complete_control or overlay in self.included_overlays

    def is_rule_included(self, owner: str, patterns: Sequence[str], driver: str) -> bool:
        if not self.complete_control or owner == driver:
            return True
        return any(pattern.partition(".")[0] in (self.name, *self.requires) for pattern in patterns)

