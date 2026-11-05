from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment


class EnvironmentTableNames(EnvironmentNames):
    """Finds an environment's id by its name in the environments table."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def environment_id(self, name: str) -> int:
        row = self.queries.query(Environment).filter(name=name).first()
        if row is None:
            raise Refusal(f"no environment named {name}", "journal environment list shows them")
        return row.id
