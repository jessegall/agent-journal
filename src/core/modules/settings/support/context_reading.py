from dataclasses import dataclass


@dataclass(frozen=True)
class ContextReading:
    """What a session's context holds: the percent in use, the tokens in use, and the limit in tokens that caps it
    while the context limit is on and comes sooner than the program's window, otherwise none."""

    percent: int | None
    used_tokens: int | None
    limit_tokens: int | None
