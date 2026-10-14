import re
from dataclasses import dataclass, field

from journal.features.nudge import Nudge


@dataclass(frozen=True)
class Said(Nudge):
    """A nudge with its values filled in, ready to render and send."""

    values: dict = field(default_factory=dict)

    def rendered(self) -> str:
        parts = (self._fill(self.title), self._fill(self.brief))
        return ". ".join(part for part in parts if part)

    def _fill(self, template: str) -> str:
        return re.sub(r"\{\{(\w+)\}\}", lambda m: str(self.values.get(m.group(1), m.group(0))), template)
