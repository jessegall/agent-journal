from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Sequence(Model):
    """Steps the agent follows in order, one at a time. Project-wide, so every environment can run it."""

    title: str = ""
    steps: tuple[str, ...] = ()
    starts_on: str = ""
    """The row event that starts it on its own, as kind.created, such as plan.created; empty for one run by hand."""
