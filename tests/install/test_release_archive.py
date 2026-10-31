import hashlib
import shutil
import subprocess

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch

ARCHIVE = "agent-journal.tar.gz"
EXCLUDED = ("node_modules", "__pycache__", ".venv", "*.pyc")


def release_with_archive(scratch: Scratch, listed_checksum: str | None = None) -> None:
    source = INSTALL.parent
    command = ["tar", "-czf", str(scratch.release / ARCHIVE), *(f"--exclude={name}" for name in EXCLUDED), "-C", str(source), "src"]
    subprocess.run(command, check=True, timeout=TIMEOUT_SECONDS)
    checksum = listed_checksum or hashlib.sha256((scratch.release / ARCHIVE).read_bytes()).hexdigest()
    (scratch.release / "checksums.txt").write_text(f"{checksum}  {ARCHIVE}\n")


def bare_script(scratch: Scratch):
    folder = scratch.project.parent / "download"
    folder.mkdir()
    shutil.copy(INSTALL, folder / "install.sh")
    return folder / "install.sh"


def run(scratch: Scratch, script) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", str(script)], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def test_a_script_with_no_code_beside_it_unpacks_the_releases_archive_into_the_projects_journal_src(tmp_path):
    scratch = Scratch(tmp_path)
    release_with_archive(scratch)
    finished = run(scratch, bare_script(scratch))
    assert finished.returncode == 0, finished.stderr
    assert (scratch.journal / "src" / "core" / "journal.py").is_file() and (scratch.journal / "version-5.db").is_file()


def test_an_archive_whose_checksum_differs_from_the_releases_is_not_installed(tmp_path):
    scratch = Scratch(tmp_path)
    release_with_archive(scratch, listed_checksum="0" * 64)
    finished = run(scratch, bare_script(scratch))
    assert finished.returncode == 1 and "does not match" in finished.stderr
    assert not scratch.journal.exists()


def test_a_release_with_no_archive_stops_the_install_and_says_so(tmp_path):
    scratch = Scratch(tmp_path)
    finished = run(scratch, bare_script(scratch))
    assert finished.returncode == 1 and "the release has no agent-journal.tar.gz" in finished.stderr
