from enum import StrEnum

from core.modules.processes.models.enums.cadence_state import CadenceState


class NoticeKind(StrEnum):
    """What a cadence notice of a run says: it printed nothing, it stopped printing, it prints too seldom, or it
    seems stuck."""

    SILENT = "no-output"
    STOPPED_WRITING = "stopped-writing"
    SPARSE = "sparse"
    FROZEN = "frozen"

    @property
    def concerns_reading(self) -> bool:
        return self in (NoticeKind.SILENT, NoticeKind.SPARSE)

    @classmethod
    def cadence_notice(cls, state: CadenceState) -> "NoticeKind | None":
        match state:
            case CadenceState.SILENT:
                return cls.SILENT
            case CadenceState.STOPPED_WRITING:
                return cls.STOPPED_WRITING
            case CadenceState.SPARSE:
                return cls.SPARSE
            case CadenceState.STREAMING:
                return None
