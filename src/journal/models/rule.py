from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text: str = ""
    reason: str = ""
