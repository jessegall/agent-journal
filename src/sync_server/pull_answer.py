from dataclasses import dataclass

from sync_server.logged_change import LoggedChange


@dataclass(frozen=True)
class PullAnswer:
    """The team's changes a device has not seen, in order, the sequence they reach, the server's time, from which the device measures its clock offset, and the journal version the team is pinned to."""

    changes: tuple[LoggedChange, ...]
    head: int
    server_time: float
    team_version: str = ""

    @classmethod
    def parsed(cls, changes: list, head: int, server_time: float, team_version: str = "") -> "PullAnswer":
        return cls(tuple(LoggedChange(**change) for change in changes), head, server_time, team_version)
