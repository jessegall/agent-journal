from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class Dump(Model):
    """Notes and files the user added, for the agent to make rows from; it closes with its outcome once
    every item is filed or failed."""

    model_name = "dump"
    cli_name = "dump"
    search_fields = ["title", "brief", "outcome"]

    creator_id: int
    title: str = ""
    brief: str
    files: tuple[str, ...] = ()
    outcome: str = ""
    closed_at: Timestamp | None = None

    @property
    def label(self) -> str:
        return self.title or f"Dump {self.id}"
