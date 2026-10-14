from enum import StrEnum


class PlanState(StrEnum):
    DRAFT = "draft"
    STARTED = "started"
    PARKED = "parked"
    DONE = "done"
