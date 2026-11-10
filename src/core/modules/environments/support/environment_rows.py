from core.base.database.kept_rows import KeptRows
from engine.errors.missing_rows_error import MissingRowsError
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment

CATALOGUE_REASON = "The environments of a project are a catalogue a person makes by hand, and every request reads them from this one kept load."


class EnvironmentRows:
    """Shares the project's environment catalogue until an environment changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def all(self) -> tuple[Environment, ...]:
        return self.kept.read("environments", lambda: tuple(self.queries.query(Environment).full_table(CATALOGUE_REASON).all_rows()), name="environments.rows")

    def find(self, environment_id: int) -> Environment:
        environment = next((row for row in self.all() if row.id == environment_id), None)
        if environment is None:
            raise MissingRowsError(Environment.cli_name, [environment_id])
        return environment

    def grants(self, environment_id: int, agent_id: int) -> bool:
        return self.find(environment_id).grants(agent_id)

    def find_many(self, environment_ids: list[int]) -> list[Environment]:
        rows = {row.id: row for row in self.all()}
        missing = [environment_id for environment_id in environment_ids if environment_id not in rows]
        if missing:
            raise MissingRowsError(Environment.cli_name, missing)
        return [rows[environment_id] for environment_id in environment_ids]
