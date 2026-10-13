from dataclasses import dataclass


@dataclass(frozen=True)
class Allowance:
    """How many times a thing may happen: the kind of thing, which one of that kind, and the number of times it is allowed."""

    kind: str
    key: str
    times: int
