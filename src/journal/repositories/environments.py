from journal.models.actor import Actor
from journal.models.all_models import AllModels
from journal.models.environment import Environment
from journal.repositories.not_found import NotFound
from journal.repositories.repository import Repository


class Environments(Repository[Environment]):
    model = Environment

    def named(self, name: str) -> Environment:
        """The environment of that name, made by the system the first time it is asked for."""
        found = self.where(name=name)
        return found[0] if found else self.save(Environment(name=name), Actor.system())

    def existing(self, name: str) -> Environment:
        """The environment of that name, which a read never makes: an unknown name is not found."""
        found = self.where(name=name)
        if not found:
            raise NotFound("environment", name)
        return found[0]

    def wipe(self, environment: Environment, by: Actor) -> None:
        """Deletes the environment and every row recorded in it, in one transaction and without a model event per row; the environment's own deletion is heard."""
        with self.connection.transaction():
            for model in AllModels.SCOPED:
                self.connection.execute(f"DELETE FROM {model.table()} WHERE environment_id = ?", (environment.id,))
            self.delete(environment, by)
