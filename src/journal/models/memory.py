from dataclasses import dataclass

from journal.models.base import Model, Scoped


@dataclass(frozen=True)
class Fact(Scoped):
    text: str = ""


@dataclass(frozen=True)
class Reminder(Scoped):
    text: str = ""


@dataclass(frozen=True)
class Rule(Model):
    """Project-wide: binds every environment."""

    text: str = ""
    reason: str = ""
