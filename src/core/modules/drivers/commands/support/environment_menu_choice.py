from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.drivers.models.environment_menu_row import EnvironmentMenuRow


@dataclass(frozen=True)
class EnvironmentMenuChoice:
    """One environment of the boot menu with the name of the suite it runs, empty when it has none yet."""

    row: EnvironmentMenuRow
    suite: str

    def json(self) -> Mapping[str, object]:
        return {"id": self.row.id, "name": self.row.name, "folder": self.row.folder, "branch": self.row.branch, "suite": self.suite, "main_running": self.row.main_running}

    def line(self) -> str:
        return f"{self.row.id}  {self.row.name}  {self.suite}  {'main agent running' if self.row.main_running else 'no main agent'}"
