from journal.features.seed import Seed
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope


class EnvironmentSeed(Seed):
    """A seed whose rows belong to environments: run once inside each environment's scope, so its reads see that environment alone."""

    def __init__(self, environments: Environments, scope: Scope) -> None:
        self.environments, self.scope = environments, scope

    def run(self) -> None:
        for environment in self.environments.all():
            with self.scope.environment(environment.row_id):
                self.run_scoped()

    def run_scoped(self) -> None:
        raise NotImplementedError
