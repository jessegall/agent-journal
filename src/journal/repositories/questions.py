from journal.models.question import Question
from journal.repositories.scoped_repository import ScopedRepository


class Questions(ScopedRepository[Question]):
    model = Question

    def open(self) -> list[Question]:
        return [q for q in self.in_() if q.answer is None]
