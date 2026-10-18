from dataclasses import dataclass

from journal.features.chart.assumptions import Assumptions


@dataclass(frozen=True)
class TrialAsked:
    """A trial as the page asks for it: the event, the row an event of a row stands for, the environment, and what to assume."""

    trigger: str = "idle"
    row: int = 0
    environment: str = "main"
    assumed: Assumptions = Assumptions()

    @classmethod
    def from_payload(cls, payload: dict) -> "TrialAsked":
        assumed = Assumptions(quiet=payload.get("quiet"), edits=payload.get("edits"), unread=payload.get("unread"), state=payload.get("state"), provider=payload.get("provider"),
                              counts={name: int(value) for name, value in (payload.get("counts") or {}).items()})
        given = {name: payload[name] for name in ("trigger", "environment", "row") if payload.get(name)}
        return cls(**given, assumed=assumed)
