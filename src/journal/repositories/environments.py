from journal.models.environment import Environment
from journal.repositories.base import Repository


class Environments(Repository[Environment]):
    model = Environment

    def named(self, name: str) -> Environment: ...
