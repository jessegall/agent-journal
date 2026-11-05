from dataclasses import dataclass
from typing import ClassVar

from core.base.change.event_log import JOURNAL_BOOTING_EVENT


@dataclass(frozen=True)
class JournalBooting:
    """The journal is starting."""

    name: ClassVar[str] = JOURNAL_BOOTING_EVENT
