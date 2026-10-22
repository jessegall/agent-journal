from dataclasses import dataclass

from sync_server.rejected_field import RejectedField


@dataclass(frozen=True)
class PushAnswer:
    """What a push is answered with: the sequence each change took, zero for one dropped, the fields that were rejected, and the server's time, from which the device measures its clock offset."""

    sequences: tuple[int, ...]
    rejected: tuple[RejectedField, ...]
    server_time: float

    @classmethod
    def parsed(cls, sequences: list, rejected: list, server_time: float) -> "PushAnswer":
        return cls(tuple(sequences), tuple(RejectedField(**field) for field in rejected), server_time)
