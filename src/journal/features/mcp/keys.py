import json

from journal.config import Config
from journal.private_folder import PrivateFolder


class Keys:
    """The keys the project's MCP servers sign in with: in a file in the home folder, outside the project, read by the supervisor into the agent's environment at launch. The journal never records a value."""

    def __init__(self, config: Config) -> None:
        self.path = PrivateFolder(config.root).keys_file()

    def all(self) -> dict[str, str]:
        return json.loads(self.path.read_text()) if self.path.is_file() else {}

    def set(self, var: str, value: str) -> None:
        PrivateFolder.made(self.path.parent)
        self.path.write_text(json.dumps({**self.all(), var: value}, indent=2) + "\n")
        self.path.chmod(0o600)

    def forget(self, var: str) -> None:
        kept = {k: v for k, v in self.all().items() if k != var}
        if self.path.is_file():
            self.path.write_text(json.dumps(kept, indent=2) + "\n")

    def has(self, var: str) -> bool:
        return bool(self.all().get(var))
