import subprocess
from pathlib import Path

from journal.config import Config

PAGE = 50
HIDDEN = ("node_modules", "__pycache__")


class ProjectFiles:
    """The project's files as the Code page reads them: a folder's entries, a file's text, its uncommitted diff, and a find by name. Nothing outside the project is ever read."""

    def __init__(self, config: Config) -> None:
        self.root = config.root.resolve()

    def folder(self, given: str) -> list[dict]:
        path = self.inside(given)
        if path is None or not path.is_dir():
            return []
        entries = sorted(path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))
        return [self.entry(p) for p in entries if not self.hidden(p)]

    def file(self, given: str) -> dict | None:
        path = self.inside(given)
        if path is None or not path.is_file():
            return None
        raw = path.read_bytes()
        try:
            text = raw.decode()
        except UnicodeDecodeError:
            return {"path": given, "kind": "binary", "size": len(raw), "lines": 0, "text": ""}
        return {"path": given, "kind": "text", "size": len(raw), "lines": len(text.splitlines()), "text": text}

    def diff(self, given: str) -> str:
        path = self.inside(given)
        if path is None:
            return ""
        return subprocess.run(["git", "diff", "--", str(path)], cwd=self.root, capture_output=True, text=True, timeout=30).stdout

    def find(self, query: str) -> list[dict]:
        """Files whose name holds every word asked for, a page at most."""
        words = query.lower().split()
        if not words:
            return []
        found = [self.entry(p) for p in sorted(self.root.rglob("*")) if p.is_file() and not self.hidden(p) and all(w in p.name.lower() for w in words)]
        return found[:PAGE]

    def inside(self, given: str) -> Path | None:
        """The path a relative name points at, or None when it is empty or leaves the project."""
        path = (self.root / given.strip("/")).resolve()
        return path if given.strip("/") and str(path).startswith(str(self.root)) else None

    def entry(self, path: Path) -> dict:
        return {"path": str(path.relative_to(self.root)), "name": path.name, "folder": path.is_dir()}

    def hidden(self, path: Path) -> bool:
        parts = path.relative_to(self.root).parts
        return any(part.startswith(".") or part in HIDDEN for part in parts)
