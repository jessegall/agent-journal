from dataclasses import dataclass


@dataclass(frozen=True)
class RoundReport:
    """A report about a plan filed during one of its review rounds, and who filed it."""

    id: int
    filed_by: str

    def json(self) -> dict[str, object]:
        return {"id": self.id, "filed_by": self.filed_by}
