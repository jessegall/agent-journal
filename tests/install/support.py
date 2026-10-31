import sqlite3
import subprocess
import sys
from pathlib import Path

INSTALL = Path(__file__).resolve().parents[2] / "install.sh"
TIMEOUT_SECONDS = 120
SYSTEM_PATH = "/usr/bin:/bin"


class Scratch:
    """A scratch folder for one install test: an empty project, a home that is not the person's, an empty release
    to download from and a folder of programs for the install's PATH, so nothing runs in a consumer project and
    nothing touches the real ~/.claude."""

    def __init__(self, folder: Path) -> None:
        self.project, self.home, self.release, self.programs = folder / "project", folder / "home", folder / "release", folder / "programs"
        for made in (self.project, self.home, self.release, self.programs):
            made.mkdir()
        (self.programs / "python3").symlink_to(sys.executable)

    @property
    def journal(self) -> Path:
        return self.project / ".journal"

    def environment(self) -> dict[str, str]:
        return {"PATH": f"{self.programs}:{SYSTEM_PATH}", "HOME": str(self.home), "JOURNAL_RELEASE_URL": self.release.as_uri(),
                "JOURNAL_PLATFORM": "linux/amd64", "LANG": "C"}

    def install(self) -> subprocess.CompletedProcess[str]:
        return subprocess.run(["sh", str(INSTALL)], cwd=self.project, env=self.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)

    def with_python(self, version: str) -> None:
        """Puts a python3 on the PATH that says it is an older version and refuses to run anything."""
        (self.programs / "python3").unlink()
        (self.programs / "python3").write_text(f'#!/bin/sh\n[ "$1" = "--version" ] && echo "Python {version}" && exit 0\nexit 1\n')
        (self.programs / "python3").chmod(0o755)

    def snapshot(self) -> dict[str, tuple[int, bytes]]:
        return {str(path.relative_to(self.project)): (path.stat().st_mtime_ns, path.read_bytes()) for path in sorted(self.project.rglob("*")) if path.is_file()}

    def tables(self, database: Path) -> set[str]:
        connection = sqlite3.connect(database)
        try:
            return {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}
        finally:
            connection.close()


