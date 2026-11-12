from enum import StrEnum

from core.modules.drivers.models.enums.compaction_reason import CompactionReason


class ContextChange(StrEnum):
    """What is done to an agent's context: it is compacted to a summary, or cleared. A program compacts by
    itself and never clears by itself, so a clear nobody asked the journal for was typed by a user."""

    COMPACT = "compact"
    CLEAR = "clear"

    @property
    def unrequested_reason(self) -> CompactionReason:
        return CompactionReason.AUTO if self is ContextChange.COMPACT else CompactionReason.TERMINAL_PERSON
