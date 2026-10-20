import os
from pathlib import Path

SECRETS_VARIABLE = "AGENT_JOURNAL_SECRETS"
"""Moves the secrets folder elsewhere."""


class PrivateFolder:
    """Where a project's private values live, outside the project in the user's home folder: the MCP servers' keys, the phone's push keys and the secrets' values, each folder readable by its user alone and kept out of git."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def keys_file(self) -> Path:
        return self.keys_folder() / f"{self.named()}.json"

    def phone_push_file(self) -> Path:
        """The journal's VAPID key pair for pushing the paired phone, beside the MCP keys and out of the agent's reach as they are."""
        return self.keys_folder() / f"{self.named()}-phone-push.json"

    @staticmethod
    def keys_folder() -> Path:
        return Path.home() / ".journal" / "keys"

    def named(self) -> str:
        """The project's folder as one file name."""
        return str(self.root.resolve()).strip("/").replace("/", "-")

    def secrets(self) -> Path:
        """The folder the variable names, else agent-journal/secrets under the config home."""
        if SECRETS_VARIABLE in os.environ:
            return Path(os.environ[SECRETS_VARIABLE])
        return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"

    @staticmethod
    def made(folder: Path) -> Path:
        folder.mkdir(parents=True, exist_ok=True)
        folder.chmod(0o700)
        ignore = folder / ".gitignore"
        if not ignore.is_file():
            ignore.write_text("*\n")
        return folder
