import os
from pathlib import Path

SECRETS_VARIABLE = "AGENT_JOURNAL_SECRETS"
"""Moves the secrets folder elsewhere."""


class PrivateFolder:
    """Where a project's private values live, outside the project in the user's home folder: the MCP servers' keys and the secrets' values, each folder readable by its user alone and kept out of git."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def keys_file(self) -> Path:
        return Path.home() / ".journal" / "keys" / f"{str(self.root.resolve()).strip('/').replace('/', '-')}.json"

    def secrets(self) -> Path:
        """The folder the variable names, else agent-journal/secrets under the config home."""
        if SECRETS_VARIABLE in os.environ:
            return Path(os.environ[SECRETS_VARIABLE])
        return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"

    @staticmethod
    def made(folder: Path) -> Path:
        """The folder a value is written into, made if it is not there, open to its user alone, with a .gitignore that leaves everything in it out of any repository it sits in."""
        folder.mkdir(parents=True, exist_ok=True)
        folder.chmod(0o700)
        ignore = folder / ".gitignore"
        if not ignore.is_file():
            ignore.write_text("*\n")
        return folder
