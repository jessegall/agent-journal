from journal.models.environment import Environment
from journal.repositories.repository import Repository


class Environments(Repository[Environment]):
    model = Environment

    def named(self, name: str) -> Environment: ...
