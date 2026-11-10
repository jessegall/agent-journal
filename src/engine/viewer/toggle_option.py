from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class ToggleOption:
    """A switch in a window's pane menu, such as Flush, kept on the pane."""

    key: str
    label: str
    default: bool = False

    def listed(self) -> Mapping[str, object]:
        return {"control": "toggle", "key": self.key, "label": self.label, "default": self.default}
