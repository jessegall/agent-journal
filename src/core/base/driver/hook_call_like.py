from typing import Protocol


class HookCallLike(Protocol):
    """The fields of a stored hook call the base reads, met by the drivers module's HookCall."""

    id: int
    refusal: str
    lines: str
