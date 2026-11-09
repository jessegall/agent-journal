import subprocess

from core.base.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.base.sandbox_level import SandboxLevel


class ShellSandbox:
    """Checks the installed runner can refuse a protected write."""

    is_required = True

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def check(self) -> None:
        binary = self.home.folder.resolve() / "bin" / "journal-run"
        try:
            process = subprocess.run([str(binary), "--sandbox-check"], capture_output=True, text=True, timeout=15)
        except (OSError, subprocess.TimeoutExpired) as error:
            raise Refusal("read-only shell sandbox could not be checked", "install journal-run with a working system sandbox") from error
        if process.returncode != 0:
            raise Refusal("read-only shell sandbox self-test failed", process.stderr.strip() or "install journal-run with a working system sandbox")
        try:
            level = SandboxLevel(process.stdout.strip())
        except ValueError as error:
            raise Refusal("read-only shell sandbox returned an unknown level", "install journal-run with sandbox support") from error
        if level is SandboxLevel.NONE:
            raise Refusal("read-only shell sandbox did not protect the shell", "enable the operating system sandbox")
