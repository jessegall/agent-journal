from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


class Entries(ScopedRepository[Entry]):
    model = Entry

    def since(self, environment_id: int, id: int) -> list[Entry]: ...
