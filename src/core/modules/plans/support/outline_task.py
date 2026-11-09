from dataclasses import dataclass


CLOSED_STATES = ("completed", "cancelled")


@dataclass(frozen=True)
class OutlineTask:
    """A plan's task as the task rows show it, and the helper it is queued for or held by."""

    id: int
    title: str
    state: str
    priority: int
    complexity: int | None
    tags: tuple[str, ...]
    reason: str
    automatic: bool
    delegated_to: int | None
    main_delegate: bool
    helper_id: int | None = None
    helper_name: str | None = None

    def is_closed(self) -> bool:
        return self.state in CLOSED_STATES
