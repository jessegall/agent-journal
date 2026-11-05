from collections.abc import Sequence
from dataclasses import dataclass
from typing import TYPE_CHECKING

from core.base.provider.session_start import SessionStart

if TYPE_CHECKING:
    from core.base.provider.provider import Provider


@dataclass(frozen=True)
class ResumedSession(SessionStart):
    """A session a launch resumes."""

    def arguments(self, provider: "Provider") -> Sequence[str]:
        return provider.resumed_arguments(self.session)
