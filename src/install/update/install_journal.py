from engine.file.file_access import FileAccess
import getpass
import os
import subprocess
import sys
from pathlib import Path

from engine.time.clock import Clock
from engine.file.copies.code_copy import CodeCopy
from engine.version.code_versions import CodeVersions
from engine.errors.refusal import Refusal
from engine.journal.journal_home import HOME_VARIABLE, JournalHome
from install.update.code_replacement import CodeReplacement
from install.backup.version_four import ANSWER, VersionFour

INSTALLED = 3
REFUSED = 1
SYNC_LIMIT_SECONDS = 120
JOURNAL_VARIABLE_PREFIX = "JOURNAL_"


class InstallJournal:
    """Puts version 5 into a project: its code copied into .journal/src, its own database synced from the core
    modules with the person who installs it made a user, so their terminal and their viewer link are a user's,
    and nothing started; the lines it runs carry none of the JOURNAL_ variables of a journal it was started
    from. It leaves a project that holds a version 4 journal as it is."""

    def __init__(self, project: Path, source: Path) -> None:
        self.project, self.source = project, source
        self.home = JournalHome(project / ".journal")

    def run(self) -> int:
        if VersionFour(self.home.folder).exists() and not FileAccess.exists(self.home.database):
            print(ANSWER, file=sys.stderr)
            return REFUSED
        if FileAccess.exists(self.home.database) and FileAccess.exists(self.entry_point()):
            print(f"version 5 is already installed in {self.home.folder}; nothing changed")
            return INSTALLED
        FileAccess.mkdir(self.home.folder, parents=True, exist_ok=True)
        try:
            CodeReplacement(self.home).run([self.copy_code, self.sync, self.person])
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
        self.journal_line("the first module sync", "module", "sync")

    def person(self) -> None:
        self.journal_line("making the person who installs a user", "actor", "make", "user", getpass.getuser())

    def journal_line(self, step: str, *argv: str) -> None:
        environment = {**{name: value for name, value in os.environ.items() if not name.startswith(JOURNAL_VARIABLE_PREFIX)}, HOME_VARIABLE: str(self.home.folder)}
        finished = subprocess.run([sys.executable, str(self.entry_point()), *argv], cwd=self.project, env=environment,
                                  capture_output=True, text=True, timeout=SYNC_LIMIT_SECONDS)
        if finished.returncode != 0:
            raise SystemExit(f"{step} failed: {finished.stdout}{finished.stderr}")


if __name__ == "__main__":
    sys.exit(InstallJournal(Path(sys.argv[1]), Path(sys.argv[2])).run())
