import json
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.types.type_guards import is_mapping

SETTINGS_FILE = Path(".claude") / "settings.json"
IGNORE_FILE = Path(".claude") / ".gitignore"
IGNORED_NAMES = "settings.json\n.gitignore\n"


class ClaudeLiveSettings:
    """Writes one key of the project settings file in an agent's folder, which a running Claude reads again when
    it changes; the file and its ignore file stay out of version control, and the file's other keys stay."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def write(self, key: str, value: object) -> None:
        path = self.folder / SETTINGS_FILE
        settings = self.settings(path)
        if settings is None or settings.get(key) == value:
            return
        ignore = self.folder / IGNORE_FILE
        if not path.exists() and not ignore.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            FileAccess.shared().write(ignore, IGNORED_NAMES)
        FileAccess.shared().write(path, json.dumps({**settings, key: value}, indent=2, sort_keys=True) + "\n")

    @staticmethod
    def settings(path: Path) -> dict[str, object] | None:
        if not path.is_file():
            return {}
        try:
            parsed: object = json.loads(FileAccess.shared().read(path) or "{}")
        except json.JSONDecodeError:
            return None
        return {str(key): value for key, value in parsed.items()} if is_mapping(parsed) else None
