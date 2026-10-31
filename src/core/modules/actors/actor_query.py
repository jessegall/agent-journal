from core.base.actor import ActorType
from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.actors.actor_record import ActorRecord


class ActorQuery(Query[ActorRecord]):
    """Reads actors, with the person a login name names: the user actor of that name, else the first person made."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, ActorRecord)

    def person(self, login_name: str) -> ActorRecord | None:
        people = self.filter(type=ActorType.USER)
        login_person = next(iter(people.filter(name=login_name).all_rows()), None) if login_name else None
        return login_person or next(iter(people.oldest().all_rows()), None)
