import inspect
from collections.abc import Sequence
from pathlib import Path

from core.base.module.code_fingerprint import CORE_FOLDER, CodeFingerprint
from core.base.module.module_finder import ModuleFinder

SERVER_FOLDER = Path(__file__).resolve().parent


class CodeFolders:
    """The folders whose Python files make up the code the server runs: the core's, each module's and the
    server's own."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def folders(self) -> Sequence[Path]:
        return [CORE_FOLDER, *(Path(inspect.getfile(module)).resolve().parent for module in self.finder.modules()), SERVER_FOLDER]


class CodeVersion:
    """The code the server started with, taken once before it imports anything else of its own; it is stale once
    a file in those folders is added, changed, moved or removed."""

    def __init__(self, fingerprint: CodeFingerprint, folders: CodeFolders) -> None:
        self.fingerprint, self.folders = fingerprint, folders
        self.text = self.current_text()

    def current_text(self) -> str:
        return self.fingerprint.folder_text(self.folders.folders())

    def is_stale(self) -> bool:
        return self.current_text() != self.text
