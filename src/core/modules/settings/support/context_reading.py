from dataclasses import dataclass


@dataclass(frozen=True)
class ContextReading:
    """What a session's context holds: the percent in use, the tokens in use, the limit in tokens that caps it
    while the context limit is on and comes sooner than the program's window, otherwise none, and the tokens of
    the program's window when its percent says them."""

    percent: int | None
    used_tokens: int | None
    limit_tokens: int | None
    window_tokens: int | None
