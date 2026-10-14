from dataclasses import dataclass
from typing import Iterator


@dataclass(frozen=True)
class StreamResponse:
    """A reply written chunk by chunk for as long as the client listens: the event stream."""

    kind: str
    chunks: Iterator[bytes]
    status: int = 200
