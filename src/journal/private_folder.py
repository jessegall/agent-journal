import os
from pathlib import Path

SECRETS_VARIABLE = "AGENT_JOURNAL_SECRETS"
"""Moves the secrets folder, as it did in version 3."""


class PrivateFolder:
    """Where a project's private values live, outside the project in the user's home folder: the MCP servers' keys and the secrets' values, each folder readable by its user alone and kept out of git."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def keys_file(self) -> Path:
        return self.made(Path.home() / ".journal" / "keys") / f"{str(self.root.resolve()).strip('/').replace('/', '-')}.json"

    def secrets(self) -> Path:
        """Version 3's place, so its values open unchanged: the folder the variable names, else under the config home."""
        if SECRETS_VARIABLE in os.environ:
            return self.made(Path(os.environ[SECRETS_VARIABLE]))
        return self.made(Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets")

    @staticmethod
    def made(folder: Path) -> Path:
        """The folder, made if it is not there, open to its user alone, with a .gitignore that leaves everything in it out of any repository it sits in."""
        folder.mkdir(parents=True, exist_ok=True)
        folder.chmod(0o700)
        ignore = folder / ".gitignore"
        if not ignore.is_file():
            ignore.write_text("*\n")
        return folder
