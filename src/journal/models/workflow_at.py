from dataclasses import dataclass


@dataclass(frozen=True)
class WorkflowAt:
    """A workflow as a new run order names it: its number and the revision it was read at."""

    id: int
    revision: int

    @classmethod
    def from_payload(cls, payload: dict) -> "WorkflowAt":
        return cls(int(payload["id"]), int(payload["revision"]))
