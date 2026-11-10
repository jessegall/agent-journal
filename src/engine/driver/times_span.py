from dataclasses import dataclass


@dataclass(frozen=True)
class TimesSpan:
    """A span of times an actor did a counted thing, counted in a row of its own and not from the hook calls."""

    unit = "times"

    count: int
