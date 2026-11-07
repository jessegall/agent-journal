from dataclasses import dataclass


@dataclass(frozen=True)
class QueuedProcessStart:
    process_id: int
    line: str
    folder: str
    session: str

