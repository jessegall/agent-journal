from dataclasses import dataclass


CLOSED_STATES = ("completed", "cancelled")


@dataclass(frozen=True)
class OutlineTask:
    """A task as a plan's outline shows it, with the worker that holds it when one does."""

    id: int
    title: str
    state: str
    worker_id: int | None = None

    def is_closed(self) -> bool:
        return self.state in CLOSED_STATES
