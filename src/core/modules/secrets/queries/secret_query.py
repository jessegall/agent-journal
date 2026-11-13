
from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.query import Query
from engine.errors.refusal import Refusal
from core.modules.secrets.models.secret import Secret


class SecretQuery(Query[Secret]):
    """Reads secrets, and one by its number or its title."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Secret)

    def find_title(self, text: str) -> Secret:
        secret = next((row for row in self.oldest().get() if str(row.id) == text or row.title.lower() == text.lower()), None)
        if secret is None:
            raise Refusal(f"no secret is numbered or titled {text!r}", "journal secret list shows them")
        return secret
