import ast
import re
from dataclasses import dataclass
from pathlib import Path

from engine.file.file_access import FileAccess

ENGINE_FOLDER = Path(__file__).resolve().parents[1]
INTERNAL_USE = re.compile(r"use = AreaUse\.INTERNAL\b")


@dataclass(frozen=True)
class SuiteRefusal:
    """One line of a suite's folder that breaks the engine's contract: the file, the line and why."""

    file: str
    line: int
    reason: str

    @property
    def text(self) -> str:
        return f"{self.file}:{self.line}: {self.reason}"


class SuiteImportCheck:
    """Checks a suite's own folder, outside the repository, by the engine's import rule: a suite imports only the
    engine's contract areas, never an area marked internal."""

    def internal_areas(self) -> frozenset[str]:
        return frozenset(folder.name for folder in FileAccess.iterdir(ENGINE_FOLDER) if FileAccess.is_dir(folder)
                         and any(INTERNAL_USE.search(FileAccess.read(marker)) for marker in FileAccess.glob(folder, "*_area.py")))

    def refusals(self, folder: Path) -> tuple[SuiteRefusal, ...]:
        internal = self.internal_areas()
        found: list[SuiteRefusal] = []
        for file in sorted(FileAccess.rglob(folder, "*.py")):
            for node in ast.walk(ast.parse(FileAccess.read(file))):
                for name in self.imported_names(node):
                    parts = name.split(".")
                    if len(parts) > 1 and parts[0] == "engine" and parts[1] in internal:
                        found.append(SuiteRefusal(str(file.relative_to(folder)), node.lineno, f"imports {name}, an internal area of the engine: use its contract areas"))
        return tuple(found)

    @staticmethod
    def imported_names(node: ast.AST) -> tuple[str, ...]:
        if isinstance(node, ast.ImportFrom) and node.module:
            return (node.module,)
        if isinstance(node, ast.Import):
            return tuple(alias.name for alias in node.names)
        return ()
