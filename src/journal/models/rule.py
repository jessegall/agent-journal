from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.rule_created import RuleCreated
from journal.models.model import Model


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text_fields: ClassVar[tuple[str, ...]] = ("text", "reason")

    text: str = ""
    reason: str = ""
    keywords: tuple[str, ...] = ()
    presence: bool = False

    def created(self, agent_index: bool) -> "Rule":
        return self.with_event(RuleCreated(agent_origin=agent_index))

    def summary_line(self) -> str:
        return self.first_line(self.text)
