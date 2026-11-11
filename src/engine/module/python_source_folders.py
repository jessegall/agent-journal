from pathlib import Path

from engine.module.code_fingerprint import CORE_FOLDER

UNTEMPLATED_FOLDERS = frozenset(("viewer", "__pycache__"))


def python_source_folders() -> tuple[Path, ...]:
    return tuple(sorted(folder for folder in CORE_FOLDER.parent.iterdir() if folder.is_dir() and folder.name not in UNTEMPLATED_FOLDERS))
