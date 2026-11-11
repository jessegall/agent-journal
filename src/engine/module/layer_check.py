import ast
from collections import defaultdict
from collections.abc import Iterator, Sequence
from pathlib import Path
from engine.map.code_map import SKIPPED_FOLDERS

from engine.file.file_access import FileAccess
from engine.module.layer import Layer
from engine.module.layer_rules import LayerRules
from engine.module.layer_table import LayerTable
from engine.module.module import Module
from engine.module.errors.module_error import ModuleError
from engine.module.module_order import ModuleOrder

DECLARATION_FILE_ENDINGS = ("module", "suite")


class LayerCheck:
    """Lists every way the source breaks the layers: a folder with no declaration, a dependency that goes up,
    a file outside every layer, an import its layer may not use, and a loop over declarations and imports."""

    def __init__(self, project_folder: Path, table: LayerTable, modules: Sequence[type[Module]]) -> None:
        self.project_folder, self.table, self.modules = project_folder, table, modules
        self.rules = LayerRules(table, modules)
        self.edges: dict[str, set[str]] = defaultdict(set)

    def failures(self) -> list[str]:
        return [*self.folder_failures(), *self.dependency_failures(), *self.source_failures(), *self.loop_failures()]

    def folder_failures(self) -> list[str]:
        declared = self.declared_folders()
        return [self.folder_failure(folder) for folder in sorted(self.module_folders()) if self.relative(folder) not in declared]

    def folder_failure(self, folder: Path) -> str:
        if any((folder / f"{folder.name}_{ending}.py").is_file() for ending in DECLARATION_FILE_ENDINGS):
            return f"{self.relative(folder)}: its declaration is not found by the loader"
        return f"{self.relative(folder)}: has no declaration class"

    def declared_folders(self) -> set[str]:
        classes = [*self.modules, *(suite for module in self.modules for suite in module.suites)]
        return {f"src/{declaration.__module__.rpartition('.')[0].replace('.', '/')}" for declaration in classes}

    def module_folders(self) -> set[Path]:
        source = self.project_folder / "src"
        parents = [source / "core" / "modules", source / "suites", source / "tunnels", *source.glob("suites/*/modules")]
        direct = {child for parent in parents if parent.is_dir() for child in parent.iterdir() if child.is_dir() and child.name not in SKIPPED_FOLDERS}
        declaration_folders = {path.parent for ending in DECLARATION_FILE_ENDINGS for path in source.rglob(f"*_{ending}.py") if path.stem == f"{path.parent.name}_{ending}" and self.is_source(path)}
        return direct | declaration_folders

    def dependency_failures(self) -> list[str]:
        return [line for module in self.modules for dependency in module.dependencies if (line := self.dependency_failure(module, dependency)) is not None]

    def dependency_failure(self, module: type[Module], dependency: str) -> str | None:
        layer = self.rules.layer_by_module.get(module.name)
        target = self.rules.layer_by_module.get(dependency)
        if target is None:
            return f"{module.name} depends on {dependency}, which is not installed"
        if layer is not None and target.tier.height > layer.tier.height:
            return f"{module.name} depends on {dependency}, which is above it"
        return None

    def source_failures(self) -> list[str]:
        lines: list[str] = []
        for path in sorted((self.project_folder / "src").rglob("*.py")):
            if self.is_source(path):
                lines.extend(self.file_failures(path))
        return lines

    def file_failures(self, path: Path) -> list[str]:
        relative = self.relative(path)
        layer = self.table.file_layer(relative)
        if layer is None:
            return [f"{relative}: the file is in no layer"]
        targets = {target for name in self.imported_names(path) if (target := self.table.import_layer(name)) is not None and target != layer}
        lines: list[str] = []
        for target in sorted(targets, key=self.layer_label):
            line = f"{relative} imports {target.label}, which {layer.label} may not use"
            self.edges[layer.label].add(target.label)
            if not self.rules.may_use(layer, target):
                lines.append(line)
        return lines

    @staticmethod
    def layer_label(layer: Layer) -> str:
        return layer.label

    def imported_names(self, path: Path) -> Iterator[str]:
        package = self.relative(path).removeprefix("src/").rpartition("/")[0].split("/")
        for node in ast.walk(ast.parse(FileAccess.shared().read(path))):
            if isinstance(node, ast.Import):
                yield from (alias.name for alias in node.names)
            if isinstance(node, ast.ImportFrom):
                base = package[:len(package) - node.level + 1] if node.level else []
                yield ".".join(base + node.module.split(".")) if node.module else ".".join(base)

    def loop_failures(self) -> list[str]:
        for module in self.modules:
            layer = self.rules.layer_by_module.get(module.name)
            if layer is not None:
                self.edges[layer.label].update(target.label for target in self.rules.declared_layers(layer))
        graph = {name: sorted(self.edges.get(name, set())) for name in {*self.edges, *(target for targets in self.edges.values() for target in targets)}}
        try:
            ModuleOrder().ordered_names(graph)
        except ModuleError as error:
            return [str(error)]
        return []

    def relative(self, path: Path) -> str:
        return path.relative_to(self.project_folder).as_posix()

    def is_source(self, path: Path) -> bool:
        return not SKIPPED_FOLDERS.intersection(path.relative_to(self.project_folder).parts)
