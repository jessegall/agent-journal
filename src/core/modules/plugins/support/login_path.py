from core.base.file_access import FileAccess
import os
import subprocess
from functools import lru_cache
from pathlib import Path

from core.base.file_version import FileVersion
from engine.journal.journal_home import JournalHome

FALLBACK_FOLDERS = ("/usr/local/bin", "/opt/homebrew/bin", "/usr/bin", "/bin")
PATH_PREFIX = "journal-path-begin:"
PATH_SUFFIX = ":journal-path-finish"
SHELL_LIMIT_SECONDS = 10


class LoginPath:
    """The PATH the user's login shell has, so a tool installed by nvm, Homebrew or asdf is found by the
    plugins the journal starts. The boot and each round of the services read the shell and keep its answer in
    a file, written only when the answer changed; asking reads the file and never waits on the shell, and
    answers the usual folders while the file is missing."""

    def __init__(self, home: JournalHome) -> None:
        self.file = home.folder / "runtime" / "login-path"

    def value(self) -> str:
        return self.kept(self.file, FileAccess.shared().version(self.file)) if self.file.is_file() else os.pathsep.join(FALLBACK_FOLDERS)

    @staticmethod
    @lru_cache(maxsize=8)
    def kept(file: Path, version: FileVersion) -> str:
        return FileAccess.shared().read(file)

    def read_shell(self) -> None:
        path = self.shell_path()
        if path and path != self.value():
            self.file.parent.mkdir(parents=True, exist_ok=True)
            FileAccess.shared().write(self.file, path)

    def fill_missing(self) -> None:
        if not self.file.is_file():
            self.read_shell()

    @staticmethod
    def shell_path() -> str:
        shell = os.environ.get("SHELL", "/bin/sh")
        try:
            output = subprocess.run([shell, "-l", "-i", "-c", f'printf "%s" "{PATH_PREFIX}$PATH{PATH_SUFFIX}"'], capture_output=True, text=True, timeout=SHELL_LIMIT_SECONDS, stdin=subprocess.DEVNULL)
        except (subprocess.TimeoutExpired, OSError):
            return ""
        opening, closing = output.stdout.rfind(PATH_PREFIX), output.stdout.rfind(PATH_SUFFIX)
        return output.stdout[opening + len(PATH_PREFIX):closing] if 0 <= opening < closing else ""
