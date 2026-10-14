from enum import StrEnum


class WorkerState(StrEnum):
    DISPATCHED = "dispatched"
    REPORTED = "reported"
    STOPPED = "stopped"
