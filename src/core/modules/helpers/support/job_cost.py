from dataclasses import dataclass


@dataclass(frozen=True)
class JobCost:
    """One job: whether it began a new program session, and what it cost in dollars when that is known."""

    new_session: bool
    dollars: float | None
