from journal.models.actor import Actor
from journal.models.environment import Environment
from journal.repositories.repository import Repository


class Environments(Repository[Environment]):
    model = Environment

    def named(self, name: str) -> Environment:
        """The environment of that name, made by the system the first time it is asked for."""
        found = self.where(name=name)
        return found[0] if found else self.save(Environment(name=name), Actor.system())
