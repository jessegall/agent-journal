from pathlib import Path

from engine.file.file_access import FileAccess

ALLOW_LIST_FILE = Path(__file__).with_name("folder_budget_allow_list.txt")
WIDTH_LIMIT_ENTRIES = 12
DEPTH_LIMIT_LEVELS = 3
STANDARD_FOLDERS = {
    "bindings", "commands", "conditions", "drivers", "enums", "errors", "expressions", "guards", "listeners", "migrations", "models", "modules", "overlays",
    "providers", "rules", "suites", "tunnels", "upgrade",
}
SKIPPED_FOLDERS = {"__pycache__", "node_modules", "dist", "web", "viewer"}
LAYER_ROOT_PARTS = {"engine": 1, "server": 1, "install": 1, "core": 3, "tunnels": 2}
SUITE_ROOT_PARTS, SUITE_MODULE_ROOT_PARTS = 2, 4


class FolderBudget:
    """Finds the folders of the source that hold more entries than the width limit and are no list of equals,
    and the Python files that sit deeper below their layer than the depth limit. Lines on the allow-list are
    the ones that exist today; a line that no longer holds is reported too, so the list only shrinks."""

    def __init__(self, source: Path, allow_list: list[str]) -> None:
        self.source = source
        self.allow_list = allow_list

    @staticmethod
    def allowed_lines() -> list[str]:
        return [line for line in FileAccess.shared().read(ALLOW_LIST_FILE).splitlines() if line]

    def failures(self) -> list[str]:
        lines = [*self.wide_folders(), *self.deep_files()]
        stale = [f"{line}: is on the allow-list but no longer happens" for line in self.allow_list if line not in lines]
        return [*(line for line in lines if line not in self.allow_list), *stale]

    def wide_folders(self) -> list[str]:
        folders = [self.source, *(folder for folder in sorted(self.source.rglob("*")) if folder.is_dir() and self.is_judged(folder))]
        return [f"{self.relative(folder)} holds more than {WIDTH_LIMIT_ENTRIES} entries" for folder in folders
                if folder.name not in STANDARD_FOLDERS and folder != self.source / "engine" and len(self.entries(folder)) > WIDTH_LIMIT_ENTRIES]

    def deep_files(self) -> list[str]:
        files = [path for path in sorted(self.source.rglob("*.py")) if self.is_judged(path) and path.name != "__init__.py"]
        return [f"{self.relative(path)} sits more than {DEPTH_LIMIT_LEVELS} levels below its layer" for path in files if self.layer_depth(path) > DEPTH_LIMIT_LEVELS]

    def layer_depth(self, path: Path) -> int:
        parts = path.relative_to(self.source).parts
        if parts[0] == "suites":
            return len(parts) - (SUITE_MODULE_ROOT_PARTS if len(parts) > 2 and parts[2] == "modules" else SUITE_ROOT_PARTS)
        return len(parts) - LAYER_ROOT_PARTS.get(parts[0], 1)

    def entries(self, folder: Path) -> list[Path]:
        return [path for path in folder.iterdir() if path.name not in SKIPPED_FOLDERS and path.name != "__init__.py" and (path.is_dir() or path.suffix == ".py")]

    def is_judged(self, path: Path) -> bool:
        return not SKIPPED_FOLDERS.intersection(path.relative_to(self.source).parts)

    def relative(self, path: Path) -> str:
        return path.relative_to(self.source.parent).as_posix()
