from core.base.file_access import FileAccess
import os
from pathlib import Path

from core.base.journal_home import JournalHome

FOLDER_VARIABLE = "AGENT_JOURNAL_SECRETS"
PROJECT_ID_FILE = "project-id"
FOLDER_MODE = 0o700


class PrivateFolder:
    """Where a project's secret values and server keys are kept, outside the project: the folder
    AGENT_JOURNAL_SECRETS names, else agent-journal/secrets in the user's config folder, readable by its user
    alone, each file named by the project's id, which version 4 kept in the same place."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def folder(self) -> Path:
        if FOLDER_VARIABLE in os.environ:
            return Path(os.environ[FOLDER_VARIABLE])
        return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"

    def file(self, suffix: str) -> Path | None:
        path = self.home.folder / PROJECT_ID_FILE
        return self.folder / f"{FileAccess.shared().read(path).strip()}{suffix}" if path.is_file() else None

    def made_file(self, suffix: str) -> Path:
        path = self.home.folder / PROJECT_ID_FILE
        if not path.is_file():
            FileAccess.shared().write(path, os.urandom(16).hex())
        return self.made_folder() / f"{FileAccess.shared().read(path).strip()}{suffix}"

    def made_folder(self) -> Path:
        self.folder.mkdir(parents=True, exist_ok=True)
        self.folder.chmod(FOLDER_MODE)
        ignore = self.folder / ".gitignore"
        if not ignore.is_file():
            FileAccess.shared().write(ignore, "*\n")
        return self.folder
