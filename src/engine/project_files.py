import mimetypes
import os
import re
import threading
import time
from dataclasses import dataclass
from pathlib import Path

from resources.base import Missing, Refused

WALKED: dict[str, tuple] = {}
WALKING: set[str] = set()
WALK_FOR = 5.0
UNLISTED = ("__pycache__", "node_modules")
SOURCE_LIMIT = 400000
SECRET = re.compile(r"^id_(rsa|dsa|ecdsa|ed25519)|credential|secret|passw|token|service-account|kubeconfig|^auth\.json$|^wp-config\.php$|\.(pem|key|p12|pfx|keystore|jks|kdbx|env|p8|ppk|tfstate|tfvars|gpg|asc)$", re.I)
STYLE = re.compile(r"\.(css|scss|sass|less|svg)$", re.I)


@dataclass(frozen=True)
class ProjectSource:
    path: str
    size: int
    kind: str
    text: str
    lines: int


def project_path(project: Path, asked: str) -> Path:
    project = project.resolve()
    target = (project / asked).resolve()
    if not asked or project not in target.parents or not readable_path(project, target):
        raise Refused(f"{asked!r} is not a file in the project that may be read")
    return target


def readable_path(project: Path, target: Path) -> bool:
    try:
        parts = target.resolve().relative_to(project.resolve()).parts
    except ValueError:
        return False
    return bool(parts) and all(not part.startswith(".") and (not SECRET.search(part) or index == len(parts) - 1 and STYLE.search(part)) for index, part in enumerate(parts))


def read_source(project: Path, asked: str) -> ProjectSource:
    target = project_path(project, asked)
    if not target.is_file():
        matches = matching(project, asked)
        if len(matches) != 1:
            raise Refused(f"{len(matches)} files in the project are called {asked!r}" if matches else f"no file {asked!r} in the project")
        target = project_path(project, matches[0])
    if not target.is_file():
        raise Refused(f"no file {asked!r} in the project")
    kind = mimetypes.guess_type(target.name)[0] or ""
    text = "" if kind.startswith("image/") else target.read_bytes()[:SOURCE_LIMIT].decode("utf-8", errors="replace")
    return ProjectSource(str(target.relative_to(project.resolve())), target.stat().st_size, kind, text, len(text.splitlines()))


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
                if not path.is_file():
                    continue
                try:
                    project_path(project, str(path.relative_to(project)))
                except Refused:
                    continue
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


def list_folder(project: Path, asked: str) -> list[dict]:
    folder = project_path(project, asked) if asked else project
    if not folder.is_dir():
        raise Missing(f"no folder {asked} in the project")
    out = []
    for entry in os.scandir(folder):
        if entry.name.startswith(".") or entry.name in UNLISTED:
            continue
        try:
            project_path(project, str(Path(entry.path).relative_to(project)))
        except Refused:
            continue
        inside = entry.is_dir()
        listed = {"path": str(Path(entry.path).relative_to(project)), "name": entry.name, "folder": inside}
        if not inside:
            listed["size"] = entry.stat().st_size
        out.append(listed)
    return sorted(out, key=lambda x: (not x["folder"], x["name"].lower()))
