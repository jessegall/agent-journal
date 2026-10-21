from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.rule_made import RuleMade
from journal.models.model import Model


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text_fields: ClassVar[tuple[str, ...]] = ("text", "reason")

    text: str = ""
    reason: str = ""
    keywords: tuple[str, ...] = ()

    def made(self, by_agent: bool) -> "Rule":
        return self.with_event(RuleMade(agent_origin=by_agent))

    def summary_line(self) -> str:
        return self.first_line(self.text)
