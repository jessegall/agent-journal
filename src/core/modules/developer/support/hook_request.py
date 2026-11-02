from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class HookRequest:
    """One hook as it was sent to the journal: when it came, for which program, its headers and its body."""

    number: int
    received_at: str
    program: str
    headers: Mapping[str, str]
    body: object

    def json(self) -> Mapping[str, object]:
        return {"id": self.number, "received_at": self.received_at, "program": self.program, "headers": self.headers, "body": self.body}
