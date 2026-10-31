import os
import shutil
import subprocess
import sys
from pathlib import Path

from core.base.journal_home import JournalHome

INSTALLED = 3
REFUSED = 1
SYNC_LIMIT_SECONDS = 120
VERSION_4_DATABASE = "journal.db"
HOME_VARIABLE = "JOURNAL_HOME"


class InstallJournal:
    """Puts version 5 into a project: its code copied into .journal/src, its own database synced from the core
    modules, and nothing started. It leaves a project that holds a version 4 journal as it is."""

    def __init__(self, project: Path, source: Path) -> None:
        self.project, self.source = project, source
        self.home = JournalHome(project / ".journal")

    def run(self) -> int:
        if (self.home.folder / VERSION_4_DATABASE).exists() and not self.home.database.exists():
            print(f"this project holds a version 4 journal in {self.home.folder / VERSION_4_DATABASE}; install changed nothing: run 'journal upgrade' to move it to version 5",
                  file=sys.stderr)
            return REFUSED
        if self.home.database.exists() and self.code().joinpath("core", "journal.py").exists():
            print(f"version 5 is already installed in {self.home.folder}; nothing changed")
            return INSTALLED
        self.copy_code()
        self.sync()
        print(f"version 5 is installed in {self.home.folder}: its code in {self.code()}, its database {self.home.database.name} synced from the core modules")
        return 0

    def code(self) -> Path:
        return self.home.folder / "src"

    def copy_code(self) -> None:
        ignored = shutil.ignore_patterns("__pycache__", "node_modules", "*.pyc", ".venv")
        shutil.copytree(self.source, self.code(), ignore=ignored, dirs_exist_ok=True)

    def sync(self) -> None:
        environment = {**os.environ, HOME_VARIABLE: str(self.home.folder)}
        finished = subprocess.run([sys.executable, str(self.code() / "core" / "journal.py"), "module", "sync"], cwd=self.project, env=environment,
                                  capture_output=True, text=True, timeout=SYNC_LIMIT_SECONDS)
        if finished.returncode != 0:
            raise SystemExit(f"the first module sync failed: {finished.stdout}{finished.stderr}")


if __name__ == "__main__":
    sys.exit(InstallJournal(Path(sys.argv[1]), Path(sys.argv[2])).run())
