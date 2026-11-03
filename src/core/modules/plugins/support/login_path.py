import os
import subprocess
from functools import cache

FALLBACK_FOLDERS = ("/usr/local/bin", "/opt/homebrew/bin", "/usr/bin", "/bin")
PATH_PREFIX = "journal-path-begin:"
PATH_SUFFIX = ":journal-path-finish"
SHELL_LIMIT_SECONDS = 10


class LoginPath:
    """The PATH the user's login shell has, read once a process from it, so a tool installed by nvm, Homebrew or
    asdf is found by the plugins the journal starts; the usual folders when the shell gives none."""

    @staticmethod
    @cache
    def value() -> str:
        return LoginPath.shell_path() or os.pathsep.join(FALLBACK_FOLDERS)

    @staticmethod
    def shell_path() -> str:
        shell = os.environ.get("SHELL", "/bin/sh")
        try:
            output = subprocess.run([shell, "-l", "-i", "-c", f'printf "%s" "{PATH_PREFIX}$PATH{PATH_SUFFIX}"'], capture_output=True, text=True, timeout=SHELL_LIMIT_SECONDS, stdin=subprocess.DEVNULL)
        except (subprocess.TimeoutExpired, OSError):
            return ""
        opening, closing = output.stdout.rfind(PATH_PREFIX), output.stdout.rfind(PATH_SUFFIX)
        return output.stdout[opening + len(PATH_PREFIX):closing] if 0 <= opening < closing else ""
