from dataclasses import dataclass

from journal.models.link import Link

THEN, YES, NO = "then", "yes", "no"
PORTS = (THEN, YES, NO)
"""A line leaves a trigger or an action by then, and a check by yes or no."""


@dataclass(frozen=True)
class DrawnLine:
    """A line as a drawing gives it: from one node's id to another's, by a port."""

    source: str
    target: str
    port: str

    @classmethod
    def from_payload(cls, payload: dict) -> "DrawnLine":
        return cls(str(payload["from"]), str(payload["to"]), payload.get("port", THEN))

    @classmethod
    def of(cls, line: Link) -> "DrawnLine":
        return cls(str(line.source.id), str(line.target.id), line.kind)
