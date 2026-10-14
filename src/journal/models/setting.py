from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Setting(Scoped):
    """One key with a JSON value. environment_id 0 is the project's, laid over every environment's own."""

    key: str = ""
    value: object = None
