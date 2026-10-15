from journal.models.phase import Phase
from journal.repositories.scoped_repository import ScopedRepository


class Phases(ScopedRepository[Phase]):
    model = Phase
