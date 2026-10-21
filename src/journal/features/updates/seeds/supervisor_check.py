from journal.features.seed import Seed
from journal.features.updates.support.outdated_supervisors import OutdatedSupervisors
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink


class SupervisorCheck(Seed):
    """At boot, after a launch, a setup restart or an update, each environment's supervisor is asked once whether its code changed since it started, and the ones that did are kept for a restart at their agent's turn end."""

    def __init__(self, environments: Environments, supervisor: SupervisorLink, outdated: OutdatedSupervisors) -> None:
        self.environments, self.supervisor, self.outdated = environments, supervisor, outdated

    def run(self) -> None:
        for environment in self.environments.all():
            if self.supervisor.is_outdated(environment.id):
                self.outdated.add(environment.id)
