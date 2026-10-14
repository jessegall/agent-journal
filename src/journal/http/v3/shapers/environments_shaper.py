from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import SYSTEM, V3Row
from journal.models.environment import Environment
from journal.repositories.environments import Environments


class EnvironmentsShaper(Shaper):
    type = "environment"

    def __init__(self, environments: Environments) -> None:
        self.environments = environments

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of("environment", e, title=e.name, seen=[SYSTEM], data={"kind": "main", "environment": e.name, "owner": ""}) for e in self.environments.all()]
