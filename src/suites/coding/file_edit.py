from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class FileEdit(Model):
    """One file an agent edited or wrote: its path and the lines it added and removed."""

    model_name = "file_edit"
    cli_name = "file-edit"

    environment_id: int
    agent_id: int
    creator_id: int
    path: str
    added: int
    removed: int
