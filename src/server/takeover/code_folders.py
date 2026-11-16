from collections.abc import Sequence
from pathlib import Path
from engine.module.code_fingerprint import CORE_FOLDER, ENGINE_FOLDER
from engine.module.module_finder import ModuleFinder


SERVER_FOLDER = Path(__file__).resolve().parents[1]


class CodeFolders:
    """The folders whose Python files make up the code the server runs: the engine's, the core's, each
    module's and the server's own."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def folders(self) -> Sequence[Path]:
        return [ENGINE_FOLDER, CORE_FOLDER, *(module.folder() for module in self.finder.modules()), SERVER_FOLDER]
