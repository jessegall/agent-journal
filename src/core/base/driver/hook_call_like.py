from typing import Protocol


class HookCallLike(Protocol):
    """The fields of a stored hook call the base reads, met by the drivers module's HookCall."""

    @property
    def id(self) -> int: ...

    @property
    def refusal(self) -> str: ...

    @property
    def lines(self) -> str: ...

    @property
    def updated_input(self) -> str: ...
