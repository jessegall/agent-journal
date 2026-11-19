from enum import StrEnum


class WorkerState(StrEnum):
    DISPATCHED = "dispatched"
    REPORTED = "reported"
    STOPPED = "stopped"
    READY = "clocked in"
    DELIVERED = "clocked out"
    CLOCKING_OUT = "clocking out"
    MERGED = "merged"
    RELEASED = "released"
    UNFINISHED = "ended without clocking out"
    LIMITED = "waiting for the usage limit"
