from dataclasses import dataclass


@dataclass(frozen=True)
class RoundReviewer:
    """A helper that read a plan during one of its review rounds."""

    agent_id: int
    name: str

    def json(self) -> dict[str, object]:
        return {"agent_id": self.agent_id, "name": self.name}
