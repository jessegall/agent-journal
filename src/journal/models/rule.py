from dataclasses import dataclass
from typing import ClassVar

from journal.models.model import Model


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text_fields: ClassVar[tuple[str, ...]] = ("text", "reason")

    text: str = ""
    reason: str = ""
    keywords: tuple[str, ...] = ()
    """Words that, when the agent writes one, bring the rule back to it as a whisper."""

