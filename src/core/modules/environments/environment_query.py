from pathlib import Path

from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.modules.environments.environment import Environment


class EnvironmentQuery(Query[Environment]):
    """Reads environments, with the one whose folder holds a given folder: the deepest such folder, both compared
    after their links are resolved."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Environment)

    def folder_environment(self, folder: str) -> Environment | None:
        if not folder:
            return None
        target = Path(folder).resolve()
        holders = [(Path(environment.folder).resolve(), environment) for environment in self.all_rows()]
        matches = [(path, environment) for path, environment in holders if path == target or path in target.parents]
        return max(matches, key=lambda match: len(match[0].parts))[1] if matches else None
