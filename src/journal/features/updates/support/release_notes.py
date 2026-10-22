from dataclasses import dataclass


@dataclass(frozen=True)
class ReleaseNotes:
    """How many release messages of the project no agent has read yet, and whether this agent's session was already pointed at them."""

    unread_count: int = 0
    is_announced: bool = False
