from engine.file.file_access import FileAccess
from collections.abc import Callable, Sequence
from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.modules.environments.support.environment_rows import EnvironmentRows


class SkillProjects:
    """The project folders where agents read skills."""

    def __init__(self, home: JournalHome, environments: EnvironmentRows) -> None:
        self.home, self.environments = home, environments

    def projects(self) -> tuple[Path, ...]:
        folders = (self.home.project_folder, *(Path(environment.folder) for environment in self.environments.all()))
        return tuple(dict.fromkeys(folder.resolve() for folder in folders if FileAccess.is_dir(folder)))

    def agent_folder(self, agent_id: int, environment_id: int) -> Path:
        return Path(self.environments.find(environment_id).folder)

    # read once per project, so a publish over every skill asks nothing more per skill
    def permitted(self, project: Path) -> Callable[[str], bool]:
        return lambda folder: True

    def roots(self, program_folders: Sequence[str]) -> tuple[Path, ...]:
        return tuple(project / folder for project in self.projects() for folder in program_folders)
