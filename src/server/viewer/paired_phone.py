import json
from dataclasses import dataclass


@dataclass(frozen=True)
class PairedPhone:
    """The paired phone a session token belongs to, as the phone module answers it: the person it acts for."""

    person_id: int

    @classmethod
    def parsed(cls, text: str) -> "PairedPhone":
        return cls(int(json.loads(text)["person_id"]))
