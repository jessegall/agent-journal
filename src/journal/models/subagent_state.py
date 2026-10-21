from enum import StrEnum


class SubagentState(StrEnum):
    ACTIVE = "running"
    FINISHED = "done"
    FAILED = "failed"
    STOPPED = "stopped"
    ENDED = "ended"
    RETIRED = "retired"
