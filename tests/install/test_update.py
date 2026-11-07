import shutil
import subprocess
from pathlib import Path

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch

EXCLUDED = ("node_modules", "__pycache__", ".venv", "*.pyc")
MARKER = "newer_marker.txt"


def checkout_copy(scratch: Scratch) -> Path:
    """A copy of this checkout's script and code, so a newer file can be added to the copy alone."""
    checkout = scratch.project.parent / "checkout"
    checkout.mkdir()
    shutil.copy(INSTALL, checkout / "install.sh")
    shutil.copytree(INSTALL.parent / "src", checkout / "src", ignore=shutil.ignore_patterns(*EXCLUDED))
    return checkout


def run(scratch: Scratch, checkout: Path, *arguments: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", str(checkout / "install.sh"), *arguments], cwd=scratch.project, env={**scratch.environment()}, capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def test_an_install_already_made_says_nothing_changed_and_update_brings_the_checkouts_newer_code(tmp_path):
    scratch = Scratch(tmp_path)
    checkout = checkout_copy(scratch)
    run(scratch, checkout)
    assert (scratch.journal / "version-5.db").is_file()
    (checkout / "src" / "core" / MARKER).write_text("newer")
    again = run(scratch, checkout)
    assert again.returncode == 0 and "already installed" in again.stdout and not (scratch.journal / "src" / "core" / MARKER).exists()
    updated = run(scratch, checkout, "update")
    assert updated.returncode == 0, updated.stdout + updated.stderr
    assert (scratch.journal / "src" / "core" / MARKER).read_text() == "newer"


def test_update_in_a_project_with_no_journal_installed_is_refused_plainly(tmp_path):
    scratch = Scratch(tmp_path)
    refused = run(scratch, checkout_copy(scratch), "update")
    assert refused.returncode == 1 and "no version 5 journal is installed" in refused.stderr
    assert not scratch.journal.exists()
