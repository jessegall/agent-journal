import os
import subprocess
import sys
from pathlib import Path

from engine.time.clock import Clock
from engine.file.code_copy import CodeCopy
from engine.version.code_versions import CodeVersions
from engine.errors.refusal import Refusal
from engine.journal.journal_home import HOME_VARIABLE, JournalHome
from install.code_replacement import CodeReplacement
from install.version_four import ANSWER, VersionFour

INSTALLED = 3
REFUSED = 1
SYNC_LIMIT_SECONDS = 120


class InstallJournal:
    """Puts version 5 into a project: its code copied into .journal/src, its own database synced from the core
    modules, and nothing started. It leaves a project that holds a version 4 journal as it is."""

    def __init__(self, project: Path, source: Path) -> None:
        self.project, self.source = project, source
        self.home = JournalHome(project / ".journal")

    def run(self) -> int:
        if VersionFour(self.home.folder).exists() and not self.home.database.exists():
            print(ANSWER, file=sys.stderr)
            return REFUSED
        if self.home.database.exists() and self.entry_point().exists():
            print(f"version 5 is already installed in {self.home.folder}; nothing changed")
            return INSTALLED
        self.home.folder.mkdir(parents=True, exist_ok=True)
        try:
            CodeReplacement(self.home).run([self.copy_code, self.sync])
        except Refusal as refusal:
            print(refusal.text, file=sys.stderr)
            return REFUSED
        print(f"version 5 is installed in {self.home.folder}: its code in {self.code()}, its database {self.home.database.name} synced from the core modules")
        return 0

    def code(self) -> Path:
        return CodeCopy(self.source, self.home).folder()

    def entry_point(self) -> Path:
        return self.code() / "engine" / "cli" / "journal.py"

    def copy_code(self) -> None:
        CodeVersions(self.home).install(self.source, Clock())

    def sync(self) -> None:
        environment = {**os.environ, HOME_VARIABLE: str(self.home.folder)}
        finished = subprocess.run([sys.executable, str(self.entry_point()), "module", "sync"], cwd=self.project, env=environment,
                                  capture_output=True, text=True, timeout=SYNC_LIMIT_SECONDS)
        if finished.returncode != 0:
            raise SystemExit(f"the first module sync failed: {finished.stdout}{finished.stderr}")


if __name__ == "__main__":
    sys.exit(InstallJournal(Path(sys.argv[1]), Path(sys.argv[2])).run())
