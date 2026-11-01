from typing import Self

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.modules.secrets.models.secret import Secret


class SecretQuery(Query[Secret]):
    """Reads secrets: those not deleted, and one by its number or its title."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Secret)

    def active(self) -> Self:
        return self.matching(IsNull("deleted_at"))

    def named(self, text: str) -> Secret:
        found = next((secret for secret in self.active().oldest().all_rows() if str(secret.id) == text or secret.title.lower() == text.lower()), None)
        if found is None:
            raise Refusal(f"no secret is numbered or titled {text!r}", "journal secret list shows them")
        return found
