"""What the secrets feature recognises: an hour in which deleted secrets may have run out their keeping."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class PurgeDue(Fact):
    """An hour has passed since deleted secrets were last checked for values past their keeping."""
