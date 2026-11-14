import json
from collections.abc import Mapping
from copy import deepcopy
from functools import lru_cache
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
from engine.types.type_guards import is_mapping


class JsonSettings:
    """Reads and writes a JSON settings file as a mapping, parsing it again only when the file changes."""

    @staticmethod
    def read(path: Path) -> dict[str, object]:
        if not FileAccess.is_file(path):
            return {}
        return deepcopy(JsonSettings.loaded(path, FileAccess.version(path)))

    @staticmethod
    @lru_cache(maxsize=128)
    def loaded(path: Path, version: FileVersion) -> dict[str, object]:
        loaded: object = json.loads(FileAccess.read(path) or "{}")
        return {str(key): value for key, value in loaded.items()} if is_mapping(loaded) else {}

    @staticmethod
    def write(path: Path, settings: Mapping[str, object]) -> None:
        FileAccess.mkdir(path.parent, parents=True, exist_ok=True)
        FileAccess.write(path, json.dumps(dict(settings), indent=2) + "\n")
