from journal.models.question import Question
from journal.repositories.scoped_repository import ScopedRepository


class Questions(ScopedRepository[Question]):
    model = Question

    def open(self) -> list[Question]:
        return self.selected("environment_id = ? AND answer IS NULL ORDER BY id", (self.scope.id,))
