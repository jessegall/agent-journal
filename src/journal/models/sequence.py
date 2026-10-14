from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Sequence(Model):
    """Steps the agent follows in order, one at a time. Project-wide, so every environment can run it."""

    title: str = ""
    steps: tuple[str, ...] = ()
