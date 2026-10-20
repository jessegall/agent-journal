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
    """Seconds before the same line may be said again to the same agent; 0 says it every time."""
    answered_in_chat: bool = False
    """Whether the agent's answer to this line is for the user and belongs in the chat, as an introduction or a reply does; otherwise a turn that only acknowledges the line is kept out of it."""
    held_whatever_its_values: bool = False
    values: dict = field(default_factory=dict)
    """Whether the repeat window holds the line whatever its values say, as for a line naming a list or a count that changes; otherwise only the same words wait."""

    def create(self, **values) -> "Nudge":
        return replace(self, values=values)

    def in_words(self, title: str) -> "Nudge":
        return replace(self, title=title, brief="", values={})

    def rendered(self) -> str:
        parts = (self._fill(self.title), self._fill(self.brief))
        return ". ".join(part for part in parts if part)

    def _fill(self, template: str) -> str:
        return re.sub(r"\{\{(\w+)\}\}", lambda m: str(self.values.get(m.group(1), m.group(0))), template)

    @property
    def key(self) -> str:
        """feature.name: what the entry records and dedupe compares."""
        return f"{self.feature}.{self.name}"
