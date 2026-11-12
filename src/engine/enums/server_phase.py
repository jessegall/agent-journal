from enum import StrEnum


class ServerPhase(StrEnum):
    """Where the journal's server is: starting up, updating to new code, or ready. While it is not ready the one
    door takes requests but starts nothing."""

    STARTING = "starting"
    UPDATING = "updating"
    READY = "ready"

    @property
    def runs_programs(self) -> bool:
        return self is ServerPhase.READY
