from core.base.database.kept_rows import KeptRows
from core.base.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment


class EnvironmentRows:
    """Shares the project's environment catalogue until an environment changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def all(self) -> tuple[Environment, ...]:
        return self.kept.read("environments", lambda: tuple(self.queries.query(Environment).all_rows()), name="environments.rows")

    def find(self, environment_id: int) -> Environment:
        environment = next((row for row in self.all() if row.id == environment_id), None)
        if environment is None:
            raise MissingRowsError(Environment.cli_name, [environment_id])
        return environment
