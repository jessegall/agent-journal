from pathlib import Path
from collections.abc import Sequence

from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment


class SkillProjects:
    """The project folders where agents read skills."""

    def __init__(self, home: JournalHome, queries: Queries) -> None:
        self.home, self.queries = home, queries

    def projects(self) -> tuple[Path, ...]:
        folders = (self.home.project_folder, *(Path(environment.folder) for environment in self.queries.query(Environment).all_rows()))
        return tuple(dict.fromkeys(folder.resolve() for folder in folders if folder.is_dir()))

    def agent_folder(self, agent_id: int, environment_id: int) -> Path:
        return Path(self.queries.query(Environment).find(environment_id).folder)

    def roots(self, program_folders: Sequence[str]) -> tuple[Path, ...]:
        return tuple(project / folder for project in self.projects() for folder in program_folders)
