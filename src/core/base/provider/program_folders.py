import os
from pathlib import Path


class ProgramFolders:
    """The user's config folders the agent programs read: a folder an environment variable names, or one under the
    home folder."""

    def folder(self, variable_name: str, default_folder: str) -> Path:
        folder_path = os.environ.get(variable_name, "")
        return Path(folder_path).expanduser() if folder_path else Path.home() / default_folder
