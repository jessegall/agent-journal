from enum import StrEnum


class AgentListState(StrEnum):
    RUNNING = "running"
    IDLE = "idle"
    RETIRED = "retired"
    ALL = "all"
