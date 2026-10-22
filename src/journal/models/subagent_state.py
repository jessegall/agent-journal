from enum import StrEnum


class SubagentState(StrEnum):
    ACTIVE = "running"
    FINISHED = "done"
    FAILED = "failed"
    UNFINISHED = "unfinished"
    STOPPED = "stopped"
    ENDED = "ended"
    RETIRED = "retired"
