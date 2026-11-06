from enum import StrEnum


class AgentListState(StrEnum):
    RUNNING = "running"
    IDLE = "idle"
    RETIRED = "retired"
    ALL = "all"

    @property
    def label(self) -> str:
        return "Working" if self is AgentListState.RUNNING else self.value.capitalize()
