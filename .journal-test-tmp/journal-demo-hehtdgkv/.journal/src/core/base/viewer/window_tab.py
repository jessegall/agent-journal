from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class WindowTab:
    """A tab inside a window: its key and label, the read line that fills it, run only when the tab is open, and
    the field of that line's answer that holds its count."""

    key: str
    label: str
    read: str
    count_field: str = ""
    component: str = ""

    def listed(self) -> Mapping[str, str]:
        return {"key": self.key, "label": self.label, "read": self.read, "count_field": self.count_field, "component": self.component}
