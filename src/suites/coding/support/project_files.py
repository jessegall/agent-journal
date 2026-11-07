from core.base.file_access import FileAccess
from pathlib import Path

from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.scope.scopes import Scopes
from core.modules.environments.models.environment import Environment
from suites.coding.support.project_file_rows import ProjectFileRows
from suites.coding.support.project_file_text import ProjectFileText
from suites.coding.support.project_git import ProjectGit

SHOWN_BYTES = 200_000
MATCH_ROW_COUNT = 50
HIDDEN_NAMES = {".git", "node_modules", "__pycache__", ".venv"}


class ProjectFiles:
    """Reads an environment's checkout: a folder's entries, the tracked files whose path holds some words, and
    one file's text; a path that leaves the checkout is refused."""

    def __init__(self, queries: Queries, git: ProjectGit, scopes: Scopes) -> None:
        self.queries, self.git, self.scopes = queries, git, scopes

    def root(self) -> Path:
        environment_id = self.scopes.environment_id
        if environment_id is None:
            raise Refusal("project files are read in one environment", "run this from an environment")
        return Path(self.queries.query(Environment).find(environment_id).folder).resolve()

    def resolved_path(self, root: Path, path: str) -> Path:
        matches = (root / path).resolve()
        if not matches.is_relative_to(root):
            raise Refusal(f"{path} is outside the project", "name a path inside the checkout")
        return matches

    def listed(self, folder: str) -> ProjectFileRows:
        root = self.root()
        place = self.resolved_path(root, folder)
        if not place.is_dir():
            raise Refusal(f"{folder} is no folder", "name a folder of the project")
        entries = [entry for entry in place.iterdir() if entry.name not in HIDDEN_NAMES]
        ordered = sorted(entries, key=lambda entry: (not entry.is_dir(), entry.name.lower()))
        return ProjectFileRows([{"id": str(entry.relative_to(root)), "name": entry.name, "folder": entry.is_dir(), "size": entry.stat().st_size if entry.is_file() else 0} for entry in ordered])

    def found(self, terms: str) -> ProjectFileRows:
        wanted = terms.lower().split()
        tracked = self.git.git_output("ls-files").splitlines()
        matching = [path for path in tracked if all(word in path.lower() for word in wanted)][:MATCH_ROW_COUNT]
        return ProjectFileRows([{"id": path, "name": Path(path).name, "folder": False, "size": 0} for path in matching])

    def shown(self, path: str) -> ProjectFileText:
        root = self.root()
        place = self.resolved_path(root, path)
        if not place.is_file():
            raise Refusal(f"{path} is no file", "name a file of the project")
        data = FileAccess.shared().binary(place)
        if b"\0" in data[:8000]:
            raise Refusal(f"{path} is not text", "it can only be opened outside the viewer")
        return ProjectFileText(path, data[:SHOWN_BYTES].decode(errors="replace"), len(data) > SHOWN_BYTES)
