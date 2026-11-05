from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows


class EnvironmentTableNames(EnvironmentNames):
    """Finds an environment's id by its name in the environments table."""

    def __init__(self, rows: EnvironmentRows) -> None:
        self.rows = rows

    def environment_id(self, name: str) -> int:
        if name.isdigit():
            return int(name)
        row = next((environment for environment in self.rows.all() if environment.name == name), None)
        if row is None:
            raise Refusal(f"no environment named {name}", "journal environment list shows them")
        return row.id
