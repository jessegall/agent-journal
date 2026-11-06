from dataclasses import dataclass


@dataclass(frozen=True)
class WorkSourceCopy:
    """The request authorized for one job when it was assigned."""

    message_id: int | None
    version: int
    environment_id: int
    unavailable: bool = False
    selecting_actor_id: int | None = None
    origin: str = "job snapshot"

    def changed(self, previous: "WorkSourceCopy | None") -> bool:
        return previous is None or previous.message_id != self.message_id or previous.unavailable != self.unavailable
