from typing import Self

from engine.query.rows.prunable import Prunable
from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.query.query import Query
from suites.coding.queries.conditions.prunable_file_edits import PrunableFileEdits

KEPT_PER_AGENT = 500


@dataclass(frozen=True, kw_only=True)
class FileEdit(Prunable, EnvironmentScoped, Model):
    """One file an agent edited or wrote: its path, the lines it added and removed, and the changed lines
    themselves. The newest 10000 edits are kept, and of those an agent keeps only its newest 500."""

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

    @classmethod
    def prunable(cls, query: Query[Self], table: str) -> Query[Self]:
        return query.matching(PrunableFileEdits(table, cls.kept_rows, KEPT_PER_AGENT))
