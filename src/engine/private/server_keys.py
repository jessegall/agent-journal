from engine.file.file_access import FileAccess
import json

from engine.file.versions.kept_file_text import KeptFileText

from engine.private.private_folder import PrivateFolder
from engine.private.secret_values import SecretValues

KEYS_SUFFIX = ".keys.json"


class ServerKeys:
    """The keys the project's MCP servers sign in with, by variable, in a file in the private folder; the
    agent programs are given them in their environment at launch, and no row or config holds one."""

    def __init__(self, folder: PrivateFolder) -> None:
        self.folder = folder
        self.kept = KeptFileText()

    def all(self) -> dict[str, str]:
        path = self.folder.file(KEYS_SUFFIX)
        return {str(name): str(value) for name, value in json.loads(self.kept.read(path)).items()} if path is not None and FileAccess.is_file(path) else {}

    def has(self, variable: str) -> bool:
        return bool(self.all().get(variable))

    def put(self, variable: str, value: str) -> None:
        self.write({**self.all(), variable: value})

    def drop(self, variable: str) -> None:
        self.write({name: value for name, value in self.all().items() if name != variable})

    def write(self, keys: dict[str, str]) -> None:
        SecretValues.write_file(self.folder.made_file(KEYS_SUFFIX), json.dumps(keys, indent=2) + "\n")
