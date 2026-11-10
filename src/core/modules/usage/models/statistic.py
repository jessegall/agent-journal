from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Statistic(Model):
    """A number the journal keeps for the whole project by its key, such as how often a profile was used or
    when it was last used."""

    model_name = "statistic"
    cli_name = "statistic"

    key: str
    value: int = 0
