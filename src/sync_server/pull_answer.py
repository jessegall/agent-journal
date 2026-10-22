from dataclasses import dataclass

from sync_server.logged_change import LoggedChange


@dataclass(frozen=True)
class PullAnswer:
    """The team's changes a device has not seen, in order, the sequence they reach, and the server's time, from which the device measures its clock offset."""

    changes: tuple[LoggedChange, ...]
    head: int
    server_time: float

    @classmethod
    def parsed(cls, changes: list, head: int, server_time: float) -> "PullAnswer":
        return cls(tuple(LoggedChange(**change) for change in changes), head, server_time)
