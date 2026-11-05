from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginDashboard:
    """A plugin's dashboard as the viewer's dashboard draws it: its title, first page and pages, or why there
    is nothing to draw."""

    fields: Mapping[str, object]

    def line(self) -> str:
        return str(self.fields.get("missing") or self.fields.get("broken") or self.fields.get("title"))

    def json(self) -> Mapping[str, object]:
        return self.fields
