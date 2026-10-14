from journal.models.fact import Fact
from journal.repositories.scoped_repository import ScopedRepository


class Facts(ScopedRepository[Fact]):
    model = Fact
