from enum import StrEnum

from core.modules.processes.models.enums.cadence_state import CadenceState


class NoticeKind(StrEnum):
    """What a cadence notice of a run says: it printed nothing, it stopped printing, it prints too seldom, or it
    seems stuck."""

    NO_OUTPUT = "no-output"
    STOPPED_WRITING = "stopped-writing"
    SPARSE = "sparse"
    FROZEN = "frozen"

    @classmethod
    def of(cls, state: CadenceState) -> "NoticeKind | None":
        match state:
            case CadenceState.NO_OUTPUT:
                return cls.NO_OUTPUT
            case CadenceState.STOPPED_WRITING:
                return cls.STOPPED_WRITING
            case CadenceState.SPARSE:
                return cls.SPARSE
            case CadenceState.STREAMING:
                return None
