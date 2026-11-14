from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class LimitEnd:
    """When a program's reached usage limit ends, and the limit a user set when that is the one that ends
    last; a plan window used up in full has no such limit."""

    ends_at: Timestamp
    limit_id: int | None = None
