from journal.db.query import Query
from journal.support.actor import Actor
from journal.models.all_models import AllModels
from journal.models.environment import Environment
from journal.support.missing_row import MissingRow
from journal.repositories.repository import Repository


class Environments(Repository[Environment]):
    model = Environment

    def lookup(self, name: str) -> Environment:
        rows = self.matching(name=name)
        return rows[0] if rows else self.save(Environment(name=name), Actor.system())

    def existing(self, name: str) -> Environment:
        rows = self.matching(name=name)
        if not rows:
            raise MissingRow("environment", name)
        return rows[0]

    def wipe(self, environment: Environment, actor: Actor) -> None:
        with self.connection.transaction():
            for model in AllModels.SCOPED:
                self.purged(Query.build(model).filter(environment_id=environment.id))
            self.delete(environment, actor)
