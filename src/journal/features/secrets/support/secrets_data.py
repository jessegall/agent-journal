import json
from dataclasses import dataclass
from pathlib import Path

MARKERS = ("agent-journal/secrets", ".journal/keys")
PATH_KEYS = ("file_path", "path", "notebook_path")


@dataclass(frozen=True)
class SecretsData:
    """The secrets feature's reading: the private folders, the secrets' and the MCP keys', by every spelling a path or a shell line may give them."""

    root: Path
    folders: tuple[Path, ...]
    spellings: tuple[str, ...]

    def reaches(self, given: dict) -> bool:
        text = json.dumps(given)
        if any(word in text for word in (*MARKERS, *self.spellings)):
            return True
        paths = [value for key, value in given.items() if key in PATH_KEYS and isinstance(value, str)]
        return any(self.is_private_path(Path(p).expanduser()) for p in paths)

    def is_private_path(self, path: Path) -> bool:
        resolved = (self.root / path).resolve()
        return any(resolved == folder or resolved.is_relative_to(folder) for folder in self.folders)
