from pathlib import Path

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.environments.support.environment_rows import EnvironmentRows


class EnvironmentQuery(Query[Environment]):
    """Finds the deepest matching folder, preferring message history when environments share it."""

    def __init__(self, database: Database, tables: Tables, activity: EnvironmentActivity, environments: EnvironmentRows) -> None:
        super().__init__(database, tables, Environment)
        self.activity, self.environments = activity, environments

    def folder_environment(self, folder: str) -> Environment | None:
        if not folder:
            return None
        target = Path(folder).resolve()
        holders = [(Path(environment.folder).resolve(), environment) for environment in self.environments.all()]
        matches = [(path, environment) for path, environment in holders if path == target or path in target.parents]
        return max(matches, key=lambda match: (len(match[0].parts), self.activity.count(match[1].id), -match[1].id))[1] if matches else None
