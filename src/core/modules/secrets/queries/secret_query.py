from core.base.query.conditions.greater import Greater
from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.secrets.models.secret import Secret


class SecretQuery(Query[Secret]):
    """Reads secrets: those not deleted, and one by its number or its title."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Secret)

    def active(self) -> Self:
        return self.matching(IsNull("deleted_at"))

    def deleted(self) -> Self:
        return self.matching(Greater("deleted_at", ""))

    def find_title(self, text: str) -> Secret:
        secret = next((row for row in self.active().oldest().all_rows() if str(row.id) == text or row.title.lower() == text.lower()), None)
        if secret is None:
            raise Refusal(f"no secret is numbered or titled {text!r}", "journal secret list shows them")
        return secret
