from enum import StrEnum


class WorkStop(StrEnum):
    """How a driver answers a stop of its own work: refused while work remains, a hand-in, or the merger's contract."""

    REFUSE_DURING_WORK = "refuse-while-work-remains"
    HANDOVER = "handover"
    MERGE_CONTRACT = "merge-contract"
