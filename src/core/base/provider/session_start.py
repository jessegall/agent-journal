from collections.abc import Sequence
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from core.base.provider.provider import Provider


@dataclass(frozen=True)
class SessionStart:
    """A new session a launch starts under the given id; an empty id lets the program name its own."""

    session: str

    def arguments(self, provider: "Provider") -> Sequence[str]:
        return provider.new_session_arguments(self.session)
