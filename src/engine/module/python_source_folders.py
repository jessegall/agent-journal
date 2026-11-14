from engine.file.file_access import FileAccess
from pathlib import Path

from engine.module.code_fingerprint import CORE_FOLDER

UNTEMPLATED_FOLDERS = frozenset(("viewer", "__pycache__"))


def python_source_folders() -> tuple[Path, ...]:
    return tuple(sorted(folder for folder in FileAccess.iterdir(CORE_FOLDER.parent) if FileAccess.is_dir(folder) and folder.name not in UNTEMPLATED_FOLDERS))
