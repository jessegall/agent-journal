import subprocess
import time
from pathlib import Path

from journal.config import Config
from journal.http.files.project_entry import ProjectEntry
from journal.http.files.project_file import ProjectFile

PAGE = 50
HIDDEN = ("node_modules", "__pycache__")


class ProjectFiles:
    """The project's files as the Files page reads them: a folder's entries, a file's text, its uncommitted diff, and a find by name. Nothing outside the project is ever read."""

    def __init__(self, config: Config) -> None:
        self.root = config.root.resolve()
        self._branch = ("", 0.0)

    def branch(self) -> str:
        name, at = self._branch
        if time.time() - at > 5:
            done = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=self.root, capture_output=True, text=True, timeout=5)
            self._branch = (done.stdout.strip() if done.returncode == 0 else "", time.time())
        return self._branch[0]

    def folder(self, given: str) -> list[ProjectEntry]:
        path = self.inside(given) if given.strip("/") else self.root
        if path is None or not path.is_dir():
            return []
        entries = sorted(path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        return [self.entry(p) for p in entries if not self.hidden(p)]

    def file(self, given: str) -> ProjectFile | None:
        path = self.inside(given)
        if path is None or not path.is_file():
            return None
        raw = path.read_bytes()
        try:
            text = raw.decode()
        except UnicodeDecodeError:
            return ProjectFile(path=given, kind="binary", size=len(raw), lines=0, text="")
        return ProjectFile(path=given, kind="text", size=len(raw), lines=len(text.splitlines()), text=text)

    def diff(self, given: str) -> str:
        path = self.inside(given)
        if path is None:
            return ""
        return subprocess.run(["git", "diff", "--", str(path)], cwd=self.root, capture_output=True, text=True, timeout=30).stdout

    def find(self, query: str) -> list[ProjectEntry]:
        words = query.lower().split()
        if not words:
            return []
        found = [self.entry(p) for p in sorted(self.root.rglob("*")) if p.is_file() and not self.hidden(p) and all(w in p.name.lower() for w in words)]
        return found[:PAGE]

    def inside(self, given: str) -> Path | None:
        path = (self.root / given.strip("/")).resolve()
        if not given.strip("/") or not path.is_relative_to(self.root):
            return None
        return None if self.hidden(path) else path

    def entry(self, path: Path) -> ProjectEntry:
        return ProjectEntry(path=str(path.relative_to(self.root)), name=path.name, folder=path.is_dir())

    def hidden(self, path: Path) -> bool:
        parts = path.relative_to(self.root).parts
        return any(part.startswith(".") or part in HIDDEN for part in parts)
