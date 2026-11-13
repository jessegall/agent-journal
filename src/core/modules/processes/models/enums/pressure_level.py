from enum import IntEnum

from core.modules.processes.models.enums.reading_exit import ReadingExit

SUGGEST_EXITS = (ReadingExit.COMPLY, ReadingExit.DECLARE_UNREADABLE)
PREVENT_EXITS = (*SUGGEST_EXITS, ReadingExit.SKIP_WITH_REASON)
BLOCK_EXITS = (*PREVENT_EXITS, ReadingExit.EXPIRES, ReadingExit.PERSON_RELEASES, ReadingExit.MAIN_AGENT_HELPS)
FREEZE_EXITS = (ReadingExit.READ_OUTPUT, ReadingExit.STOP_RUN, ReadingExit.PERSON_RELEASES)


class PressureLevel(IntEnum):
    """How hard the engine presses an agent, from a line it may pass over to a hold on every tool."""

    SUGGEST = 1
    PREVENT = 2
    BLOCK = 3
    FREEZE = 4

    @property
    def exits(self) -> tuple[ReadingExit, ...]:
        match self:
            case PressureLevel.SUGGEST:
                return SUGGEST_EXITS
            case PressureLevel.PREVENT:
                return PREVENT_EXITS
            case PressureLevel.BLOCK:
                return BLOCK_EXITS
            case PressureLevel.FREEZE:
                return FREEZE_EXITS
