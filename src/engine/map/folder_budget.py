from pathlib import Path

from engine.file.file_access import CODE_TREE_DEPTH, FileAccess

ALLOW_LIST_FILE = Path(__file__).with_name("folder_budget_allow_list.txt")
WIDTH_LIMIT_ENTRIES = 12
DEPTH_LIMIT_LEVELS = 3
STANDARD_FOLDERS = {
    "ask_topics", "bindings", "buttons", "commands", "conditions", "drivers", "enums", "errors", "expressions", "guards", "inspectors", "listeners", "marks",
    "migrations", "models", "modules", "agent_messages", "providers", "rules", "suites", "tick_handlers", "tunnels", "upgrade",
}
# a folder of one thing's declarations, such as a window's keys: a list of equals, at the level of the thing it declares for
DECLARATION_FOLDERS = {"keys", "declarations"}
# the folders a module keeps its parts in: a module's own folder is the list of them, so they are not counted against its width
MODULE_PART_FOLDERS = {"docks", "entrances", "queries", "seeders", "settings", "skills", "support", "templates", "ticks", "windows"}
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
        return [line for line in FileAccess.read(ALLOW_LIST_FILE).splitlines() if line]

    def failures(self) -> list[str]:
        lines = [*self.wide_folders(), *self.deep_files()]
        stale = [f"{line}: is on the allow-list but no longer happens" for line in self.allow_list if line not in lines]
        return [*(line for line in lines if line not in self.allow_list), *stale]

    def wide_folders(self) -> list[str]:
        folders = [self.source, *(folder for folder in sorted(FileAccess.rglob(self.source, "*", CODE_TREE_DEPTH)) if FileAccess.is_dir(folder) and self.is_judged(folder))]
        return [f"{self.relative(folder)} holds more than {WIDTH_LIMIT_ENTRIES} entries" for folder in folders
                if folder.name not in STANDARD_FOLDERS | DECLARATION_FOLDERS and folder != self.source / "engine" and len(self.counted_entries(folder)) > WIDTH_LIMIT_ENTRIES]

    def deep_files(self) -> list[str]:
        files = [path for path in sorted(FileAccess.rglob(self.source, "*.py", CODE_TREE_DEPTH)) if self.is_judged(path) and path.name != "__init__.py"]
        return [f"{self.relative(path)} sits more than {DEPTH_LIMIT_LEVELS} levels below its layer" for path in files if self.layer_depth(path) > DEPTH_LIMIT_LEVELS]

    def layer_depth(self, path: Path) -> int:
        parts = path.relative_to(self.source).parts
        set_parent = 1 if path.parent.name in DECLARATION_FOLDERS else 0
        if parts[0] == "suites":
            return len(parts) - set_parent - (SUITE_MODULE_ROOT_PARTS if len(parts) > 2 and parts[2] == "modules" else SUITE_ROOT_PARTS)
        return len(parts) - set_parent - LAYER_ROOT_PARTS.get(parts[0], 1)

    def counted_entries(self, folder: Path) -> list[Path]:
        entries = self.entries(folder)
        if folder.parent.name != "modules":
            return entries
        return [path for path in entries if path.name not in STANDARD_FOLDERS | MODULE_PART_FOLDERS]

    def entries(self, folder: Path) -> list[Path]:
        return [path for path in FileAccess.iterdir(folder) if path.name not in SKIPPED_FOLDERS and path.name != "__init__.py" and (FileAccess.is_dir(path) or path.suffix == ".py")]

    def is_judged(self, path: Path) -> bool:
        return not SKIPPED_FOLDERS.intersection(path.relative_to(self.source).parts)

    def relative(self, path: Path) -> str:
        return path.relative_to(self.source.parent).as_posix()
