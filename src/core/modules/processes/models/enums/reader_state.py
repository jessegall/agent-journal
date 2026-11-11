from enum import StrEnum

from core.modules.processes.models.enums.reason_code import ReasonCode


class ReaderState(StrEnum):
    """How well a command's output is read: no reader needed, a reader that fits, a poor one, a draft that would
    fit, none at all, or an output no reader can read."""

    NOT_NEEDED = "not needed"
    SUITABLE = "suitable"
    POOR = "poor"
    DRAFTABLE = "draftable"
    MISSING = "missing"
    UNREADABLE = "unreadable"

    @property
    def lacks_a_reader(self) -> bool:
        return self in (ReaderState.POOR, ReaderState.MISSING, ReaderState.DRAFTABLE)

    @property
    def reason_code(self) -> ReasonCode:
        match self:
            case ReaderState.POOR:
                return ReasonCode.FIELDS_MISSING
            case ReaderState.DRAFTABLE:
                return ReasonCode.DRAFT_FITS
            case ReaderState.MISSING:
                return ReasonCode.READER_MISSING
            case ReaderState.UNREADABLE:
                return ReasonCode.UNREADABLE
            case ReaderState.NOT_NEEDED | ReaderState.SUITABLE:
                return ReasonCode.NONE
