from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
import os
from pathlib import Path

from engine.journal.journal_home import JournalHome

FOLDER_VARIABLE = "AGENT_JOURNAL_SECRETS"
PROJECT_ID_FILE = "project-id"
FOLDER_MODE = 0o700


class PrivateFolder:
    """Where a project's secret values and server keys are kept, outside the project: the folder
    AGENT_JOURNAL_SECRETS names, else agent-journal/secrets in the user's config folder, readable by its user
    alone, each file named by the project's id, which version 4 kept in the same place."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.project_ids: dict[FileVersion, str] = {}

    @property
    def folder(self) -> Path:
        if FOLDER_VARIABLE in os.environ:
            return Path(os.environ[FOLDER_VARIABLE])
        return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"

    def file(self, suffix: str) -> Path | None:
        path = self.home.folder / PROJECT_ID_FILE
        return self.folder / f"{self.project_id()}{suffix}" if FileAccess.is_file(path) else None

    def made_file(self, suffix: str) -> Path:
        path = self.home.folder / PROJECT_ID_FILE
        if not FileAccess.is_file(path):
            FileAccess.write(path, os.urandom(16).hex())
            self.project_ids.clear()
        return self.made_folder() / f"{self.project_id()}{suffix}"

    def project_id(self) -> str:
        path = self.home.folder / PROJECT_ID_FILE
        version = FileAccess.version(path)
        if version not in self.project_ids:
            self.project_ids = {version: FileAccess.read(path).strip()}
        return self.project_ids[version]

    def made_folder(self) -> Path:
        FileAccess.mkdir(self.folder, parents=True, exist_ok=True)
        FileAccess.chmod(self.folder, FOLDER_MODE)
        ignore = self.folder / ".gitignore"
        if not FileAccess.is_file(ignore):
            FileAccess.write(ignore, "*\n")
        return self.folder
