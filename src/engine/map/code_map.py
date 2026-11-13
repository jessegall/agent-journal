import ast
from pathlib import Path

from engine.enums.area_use import AreaUse
from engine.file.file_access import FileAccess
from engine.map.errors.missing_summary_error import MissingSummaryError

TOP_FOLDERS = {
    "engine": "The building blocks every module stands on; it imports no module.",
    "core": "The modules that come with every journal.",
    "suites": "Suites: the modules and drivers for one sort of work.",
    "tunnels": "Tunnels that reach the viewer from outside the machine.",
    "server": "The server process: requests, the routes of the viewer, the handover of code and timed work.",
    "install": "Installing, updating and upgrading a journal.",
    "viewer": "The web code of the viewer.",
}
STANDARD_FOLDERS = {"errors", "enums", "__pycache__"}
SKIPPED_FOLDERS = {"__pycache__", "node_modules"}
LEVEL_INDENT = "  "


class CodeMap:
    """Builds the map of the code under a source folder: one line for each top folder, engine area, core
    module, suite and tunnel. It reads files only and shows structure, never what runs."""

    def __init__(self, source: Path, files: FileAccess) -> None:
        self.source = source
        self.files = files

    def text(self) -> str:
        return "\n".join(self.lines()) + "\n"

    def lines(self) -> list[str]:
        unknown = sorted(set(self.folder_names(self.source)) - set(TOP_FOLDERS))
        if unknown:
            raise MissingSummaryError(f"src/{unknown[0]}", "add its line to TOP_FOLDERS in src/engine/map/code_map.py")
        tops = [name for name in TOP_FOLDERS if (self.source / name).is_dir()]
        return [line for name in tops for line in (f"{name}{LEVEL_INDENT}{TOP_FOLDERS[name]}", *self.second_level_lines(name))]

    def second_level_lines(self, top: str) -> list[str]:
        builders = {"engine": self.engine_lines, "core": self.module_lines, "suites": self.suite_lines, "tunnels": self.tunnel_lines}
        return builders[top]() if top in builders else []

    def engine_lines(self) -> list[str]:
        areas = [(name, *self.marker_values(name)) for name in self.folder_names(self.source / "engine") if name not in STANDARD_FOLDERS]
        lines: list[str] = []
        for use in AreaUse:
            area_lines = [f"{LEVEL_INDENT * 2}{name}{LEVEL_INDENT}{summary}" for name, summary, area_use in areas if area_use == use.value]
            lines += [f"{LEVEL_INDENT}{use.value}", *area_lines] if area_lines else []
        return lines

    def marker_values(self, area: str) -> tuple[str, str]:
        marker = self.source / "engine" / area / f"{area}_area.py"
        folder = f"src/engine/{area}"
        if not marker.is_file():
            raise MissingSummaryError(folder, f"write {folder}/{area}_area.py with a class that sets summary and use")
        values = self.class_values(self.classes(marker))
        summary, use = values.get("summary"), values.get("use")
        if not isinstance(summary, ast.Constant) or not isinstance(summary.value, str) or not isinstance(use, ast.Attribute):
            raise MissingSummaryError(folder, f"set summary to one line of text and use to a value of AreaUse in {area}_area.py")
        return summary.value, use.attr.lower()

    def class_values(self, classes: list[ast.ClassDef]) -> dict[str, ast.expr]:
        assigned = [node for node in classes[-1].body if isinstance(node, ast.Assign)] if classes else []
        return {target.id: node.value for node in assigned for target in node.targets if isinstance(target, ast.Name)}

    def classes(self, file: Path) -> list[ast.ClassDef]:
        folder = file.parent.relative_to(self.source.parent).as_posix()
        if not file.is_file():
            raise MissingSummaryError(folder, f"write {file.name} with a class whose docstring says what the folder is for")
        try:
            return [node for node in ast.parse(self.files.read(file)).body if isinstance(node, ast.ClassDef)]
        except SyntaxError as error:
            raise MissingSummaryError(folder, f"{file.name} cannot be read as Python") from error

    def module_lines(self) -> list[str]:
        folder = self.source / "core" / "modules"
        return [self.module_line(name, folder / name / f"{name}_module.py") for name in self.folder_names(folder)]

    def module_line(self, name: str, file: Path) -> str:
        classes = self.classes(file)
        return f"{LEVEL_INDENT}{name}{LEVEL_INDENT}{self.purpose(file, classes)}{self.needed_modules(classes)}"

    def suite_lines(self) -> list[str]:
        lines = []
        for name in self.folder_names(self.source / "suites"):
            modules = self.folder_names(self.source / "suites" / name / "modules")
            listed = f" Modules: {', '.join(modules)}." if modules else ""
            lines.append(f"{LEVEL_INDENT}{name}{LEVEL_INDENT}{self.described_purpose(self.source / 'suites' / name / f'{name}_suite.py')}{listed}")
        return lines

    def tunnel_lines(self) -> list[str]:
        folder = self.source / "tunnels"
        return [f"{LEVEL_INDENT}{name}{LEVEL_INDENT}{self.described_purpose(folder / name / f'{name}_module.py')}" for name in self.folder_names(folder)]

    def described_purpose(self, file: Path) -> str:
        return self.purpose(file, self.classes(file))

    def purpose(self, file: Path, classes: list[ast.ClassDef]) -> str:
        described = [text for node in classes for text in [ast.get_docstring(node)] if text]
        if not described:
            folder = file.parent.relative_to(self.source.parent).as_posix()
            raise MissingSummaryError(folder, f"write a docstring on the class in {file.name} that says what the folder is for")
        return " ".join(described[-1].split())

    def needed_modules(self, classes: list[ast.ClassDef]) -> str:
        declared_value = self.class_values(classes).get("dependencies")
        module_names = [element.value for element in declared_value.elts if isinstance(element, ast.Constant)] if isinstance(declared_value, ast.List) else []
        return f" Needs: {', '.join(str(module_name) for module_name in module_names)}." if module_names else ""

    def folder_names(self, folder: Path) -> list[str]:
        if not folder.is_dir():
            return []
        return sorted(path.name for path in folder.iterdir() if path.is_dir() and path.name not in SKIPPED_FOLDERS and not self.holds_only_caches(path))

    @staticmethod
    def holds_only_caches(folder: Path) -> bool:
        """A folder left with nothing but caches after its files moved is no part of the code, as version control keeps no such folder."""
        entries = [child.name for child in folder.iterdir()]
        return bool(entries) and all(name in SKIPPED_FOLDERS for name in entries)
