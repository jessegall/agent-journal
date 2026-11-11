import json
from functools import lru_cache
from pathlib import Path
from typing import Mapping

from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
from engine.types.type_guards import is_text_mapping


STATUS_CACHE_SIZE = 64


class StatusFileFields:
    """The fields of a program's status file, read once for each version of the file."""

    @staticmethod
    @lru_cache(maxsize=STATUS_CACHE_SIZE)
    def read(path: Path, version: FileVersion) -> Mapping[str, object]:
        fields: object = json.loads(FileAccess.shared().read(path) or "{}")
        return fields if is_text_mapping(fields) else {}
