from enum import StrEnum


class WorkStop(StrEnum):
    """How a driver answers a stop of its own work: refused while work remains, a hand-in, or the merger's contract."""

    REFUSE_WHILE_WORK_REMAINS = "refuse-while-work-remains"
    HAND_IN = "hand-in"
    MERGE_CONTRACT = "merge-contract"
