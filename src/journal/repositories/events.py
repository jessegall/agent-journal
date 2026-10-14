from journal.models.event import Event
from journal.repositories.base import ScopedRepository


class Events(ScopedRepository[Event]):
    model = Event

    def since(self, environment_id: int, id: int) -> list[Event]: ...
