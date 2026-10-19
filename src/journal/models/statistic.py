from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Statistic(Model):
    """A number the journal keeps for the whole project by its key, such as how often something ran or when it last did; the viewer names it for the user."""

    key: str = ""
    value: int = 0
