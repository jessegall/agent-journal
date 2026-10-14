"""What the put-off work feature recognises: the agent putting work off in words with nothing filed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WorkDeferred(Fact):
    """Work the agent said it would do later, with the words it used."""

    agent: int
    words: str
