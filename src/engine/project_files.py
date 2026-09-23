import os
import threading
import time
from pathlib import Path

WALKED: dict[str, tuple] = {}
WALKING: set[str] = set()
WALK_FOR = 5.0
UNLISTED = ("__pycache__", "node_modules")


def walked(project: Path) -> tuple[list[Path], dict[str, list[str]]]:
    held = WALKED.get(str(project))
    if not held:
        return walk(project)
    if time.time() - held[0] >= WALK_FOR and str(project) not in WALKING:
        WALKING.add(str(project))
        threading.Thread(target=walk, args=(project,), daemon=True).start()
    return held[1], held[2]


def walk(project: Path) -> tuple[list[Path], dict[str, list[str]]]:
    paths, by_name = [], {}
    try:
        for folder, dirs, names in os.walk(project):
            dirs[:] = [name for name in dirs if not name.startswith(".") and name not in UNLISTED]
            for path in (Path(folder) / name for name in names):
                if path.is_file():
                    paths.append(path)
                    by_name.setdefault(path.name, []).append(str(path.relative_to(project)))
        WALKED[str(project)] = (time.time(), paths, by_name)
    finally:
        WALKING.discard(str(project))
    return paths, by_name


def project_paths(project: Path) -> list[Path]:
    return walked(project)[0]


def matching(project: Path, asked: str) -> list[str]:
    paths, by_name = walked(project)
    if "/" not in asked:
        return sorted(by_name.get(asked, []))
    tail = f"/{asked.lstrip('./')}"
    return sorted(rel for rel in (str(path.relative_to(project)) for path in paths) if f"/{rel}".endswith(tail))
