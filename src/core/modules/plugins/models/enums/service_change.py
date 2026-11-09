from enum import StrEnum


class ServiceChange(StrEnum):
    """What can be asked of one plugin service."""

    STOP = "stop"
    START = "start"
    RESTART = "restart"

    @property
    def stops(self) -> bool:
        return self is not ServiceChange.START

    @property
    def starts(self) -> bool:
        return self is not ServiceChange.STOP
