import re
from dataclasses import dataclass, field, replace


@dataclass(frozen=True)
class Nudge:
    """A line a feature can say to the agent, declared once: its name, its words as a template, and the feature that owns it, whose switch silences it."""

    feature: str
    name: str
    title: str
    brief: str = ""
    repeat_after: float = 300.0
    answered_in_chat: bool = False
    held_whatever_its_values: bool = False
    values: dict = field(default_factory=dict)

    def create(self, **values) -> "Nudge":
        return replace(self, values=values)

    def text(self, title: str) -> "Nudge":
        return replace(self, title=title, brief="", values={})

    def rendered(self) -> str:
        title, brief = self._fill(self.title), self._fill(self.brief)
        if not brief:
            return title
        return f"{title} {brief}" if title.endswith(("?", "!", ".")) else f"{title}. {brief}"

    def _fill(self, template: str) -> str:
        return re.sub(r"\{\{(\w+)\}\}", lambda m: str(self.values.get(m.group(1), m.group(0))), template)

    @property
    def key(self) -> str:
        return f"{self.feature}.{self.name}"
