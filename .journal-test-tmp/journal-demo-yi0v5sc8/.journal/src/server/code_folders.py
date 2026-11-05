from collections.abc import Sequence
from pathlib import Path
from core.base.module.code_fingerprint import CORE_FOLDER
from core.base.module.module_finder import ModuleFinder


SERVER_FOLDER = Path(__file__).resolve().parent


class CodeFolders:
    """The folders whose Python files make up the code the server runs: the core's, each module's and the
    server's own."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def folders(self) -> Sequence[Path]:
        return [CORE_FOLDER, *(module.folder() for module in self.finder.modules()), SERVER_FOLDER]
