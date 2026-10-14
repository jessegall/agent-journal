from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Scoped(Model):
    """A row that belongs to one environment."""

    environment_id: int = 0
