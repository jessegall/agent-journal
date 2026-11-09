import json
from functools import lru_cache
from pathlib import Path
from typing import Mapping

from core.base.file_access import FileAccess
from core.base.file_version import FileVersion


class StatusFileFields:
    """The fields of a program's status file, read once for each version of the file."""

    @staticmethod
    @lru_cache(maxsize=64)
    def read(path: Path, version: FileVersion) -> Mapping[str, object]:
        fields = json.loads(FileAccess.shared().read(path) or "{}")
        return fields if isinstance(fields, dict) else {}
