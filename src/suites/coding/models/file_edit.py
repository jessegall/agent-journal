from engine.model.prunable import Prunable
from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class FileEdit(Prunable, EnvironmentScoped, Model):
    """One file an agent edited or wrote: its path, the lines it added and removed, and the changed lines
    themselves."""

    kept_rows = 10000

    model_name = "file_edit"
    cli_name = "file-edit"
    search_fields = ["path"]

    environment_id: int = 0
    session_agent_id: int
    creator_id: int
    path: str
    added: int
    removed: int
    rows: str = "[]"
    edit_type: str = "edit"
