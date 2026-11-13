from dataclasses import dataclass


@dataclass(frozen=True)
class Usable:
    """The agent a rule's target resolves to now, or why none can take the task; for a usable agent the reason
    notes a limit or a pause."""

    actor_id: int | None
    reason: str | None
