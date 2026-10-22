import os
from pathlib import Path

SECRETS_VARIABLE = "AGENT_JOURNAL_SECRETS"


class PrivateFolder:
    """Where a project's private values live, outside the project in the user's home folder: the MCP servers' keys, the phone's push keys and the secrets' values, each folder readable by its user alone and kept out of git."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def keys_file(self) -> Path:
        return self.keys_folder() / f"{self.path()}.json"

    def phone_push_file(self) -> Path:
        return self.keys_folder() / f"{self.path()}-phone-push.json"

    @staticmethod
    def keys_folder() -> Path:
        return Path.home() / ".journal" / "keys"

    def path(self) -> str:
        return str(self.root.resolve()).strip("/").replace("/", "-")

    def secrets(self) -> Path:
        if SECRETS_VARIABLE in os.environ:
            return Path(os.environ[SECRETS_VARIABLE])
        return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"

    @staticmethod
    def created(folder: Path) -> Path:
        folder.mkdir(parents=True, exist_ok=True)
        folder.chmod(0o700)
        ignore = folder / ".gitignore"
        if not ignore.is_file():
            ignore.write_text("*\n")
        return folder
