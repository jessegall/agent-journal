from journal.models.question import Question
from journal.repositories.scoped_repository import ScopedRepository


class Questions(ScopedRepository[Question]):
    model = Question

    def open(self, environment_id: int) -> list[Question]: ...
