from typing import Protocol


class ContextOwner(Protocol):
    """An agent as the context share reads it: its program and session, and the role and profile its cap is set by."""

    @property
    def program(self) -> str: ...

    @property
    def session(self) -> str: ...

    @property
    def role(self) -> str: ...

    @property
    def profile(self) -> str: ...
