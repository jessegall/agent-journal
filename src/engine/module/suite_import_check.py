import ast
import re
from collections.abc import Collection
from pathlib import Path

from engine.file.file_access import CODE_TREE_DEPTH, FileAccess

from engine.module.suite_contract_breach import SuiteContractBreach
from engine.module.module_imports import ModuleImports
ENGINE_FOLDER = Path(__file__).resolve().parents[1]
INTERNAL_USE = re.compile(r"use = AreaUse\.INTERNAL\b")


class SuiteImportCheck:
    """Checks a suite's own folder, outside the repository, by the engine's import rule: a suite imports only the
    engine's contract areas, never an area marked internal."""

    def internal_areas(self) -> frozenset[str]:
        return frozenset(folder.name for folder in FileAccess.iterdir(ENGINE_FOLDER) if FileAccess.is_dir(folder)
                         and any(INTERNAL_USE.search(FileAccess.read(marker)) for marker in FileAccess.glob(folder, "*_area.py")))

    def refusals(self, folder: Path) -> tuple[SuiteContractBreach, ...]:
        internal = self.internal_areas()
        imports = [(file, node, name) for file in sorted(FileAccess.rglob(folder, "*.py", CODE_TREE_DEPTH)) for node in ast.walk(ast.parse(FileAccess.read(file))) for name in self.imported_names(node)]
        return tuple(SuiteContractBreach(str(file.relative_to(folder)), node.lineno, f"imports {name}, an internal area of the engine: use its contract areas")
                     for file, node, name in imports if self.is_internal(name, internal))

    @staticmethod
    def is_internal(name: str, internal: Collection[str]) -> bool:
        parts = name.split(".")
        return len(parts) > 1 and parts[0] == "engine" and parts[1] in internal

    @staticmethod
    def imported_names(node: ast.AST) -> tuple[str, ...]:
        if ModuleImports.is_module_import(node):
            return (node.module,)
        if isinstance(node, ast.Import):
            return tuple(alias.name for alias in node.names)
        return ()
