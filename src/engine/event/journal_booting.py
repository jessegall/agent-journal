from dataclasses import dataclass
from typing import ClassVar

from engine.event.event_log import JOURNAL_BOOTING_EVENT
from engine.event.system_event import SystemEvent


@dataclass(frozen=True)
class JournalBooting(SystemEvent):
    """The journal is starting."""

    name: ClassVar[str] = JOURNAL_BOOTING_EVENT
