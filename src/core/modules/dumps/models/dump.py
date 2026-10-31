from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class Dump(Model):
    """Notes and files the user poured in, for the agent to make rows from; it closes with its outcome once every
    item is filed or failed."""

    model_name = "dump"
    cli_name = "dump"

    environment_id: int
    creator_id: int
    title: str = ""
    brief: str
    files: tuple[str, ...] = ()
    outcome: str = ""
    closed_at: Timestamp | None = None

    @property
    def label(self) -> str:
        return self.title or f"Dump {self.id}"
