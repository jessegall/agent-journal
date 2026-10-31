from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from suites.coding.modules.workers.models.proof import Proof


class ProofQuery(Query[Proof]):
    """Reads proofs, with the proofs of one task by name."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Proof)

    def task_proofs(self, task_id: int) -> Self:
        return self.filter(task_id=task_id)
