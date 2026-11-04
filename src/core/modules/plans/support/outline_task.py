from dataclasses import dataclass


CLOSED_STATES = ("completed", "cancelled")


@dataclass(frozen=True)
class OutlineTask:
    """A plan's task summary and the helper holding it."""

    id: int
    title: str
    state: str
    helper_id: int | None = None

    def is_closed(self) -> bool:
        return self.state in CLOSED_STATES
