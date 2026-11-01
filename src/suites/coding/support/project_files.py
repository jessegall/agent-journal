import subprocess
from pathlib import Path

from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_file_text import ProjectFileText

GIT_LIMIT_SECONDS = 5
SHOWN_BYTES = 200_000
FOUND_ROW_COUNT = 50
HIDDEN_NAMES = {".git", "node_modules", "__pycache__", ".venv"}


class ProjectFiles:
    """Reads an environment's checkout: a folder's entries, the tracked files whose path holds some words, and one
    file's text; a path that leaves the checkout is refused."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def root(self, environment_id: int | None) -> Path:
        if environment_id is None:
            raise Refusal("project files are read in one environment", "run this from an environment")
        return Path(self.queries.query(Environment).find(environment_id).folder).resolve()

    def inside(self, root: Path, path: str) -> Path:
        found = (root / path).resolve()
        if not found.is_relative_to(root):
            raise Refusal(f"{path} is outside the project", "name a path inside the checkout")
        return found

    def listed(self, environment_id: int | None, folder: str) -> ProjectFileRows:
        root = self.root(environment_id)
        place = self.inside(root, folder)
        if not place.is_dir():
            raise Refusal(f"{folder} is no folder", "name a folder of the project")
        entries = [entry for entry in place.iterdir() if entry.name not in HIDDEN_NAMES]
        ordered = sorted(entries, key=lambda entry: (not entry.is_dir(), entry.name.lower()))
        return ProjectFileRows([{"id": str(entry.relative_to(root)), "name": entry.name, "folder": entry.is_dir(), "size": entry.stat().st_size if entry.is_file() else 0} for entry in ordered])

    def found(self, environment_id: int | None, words: str) -> ProjectFileRows:
        root = self.root(environment_id)
        wanted = words.lower().split()
        tracked = subprocess.run(["git", "ls-files"], cwd=root, capture_output=True, text=True, check=False, timeout=GIT_LIMIT_SECONDS).stdout.splitlines()
        matching = [path for path in tracked if all(word in path.lower() for word in wanted)][:FOUND_ROW_COUNT]
        return ProjectFileRows([{"id": path, "name": Path(path).name, "folder": False, "size": 0} for path in matching])

    def shown(self, environment_id: int | None, path: str) -> ProjectFileText:
        root = self.root(environment_id)
        place = self.inside(root, path)
        if not place.is_file():
            raise Refusal(f"{path} is no file", "name a file of the project")
        data = place.read_bytes()
        if b"\0" in data[:8000]:
            raise Refusal(f"{path} is not text", "it can only be opened outside the viewer")
        return ProjectFileText(path, data[:SHOWN_BYTES].decode(errors="replace"), len(data) > SHOWN_BYTES)
