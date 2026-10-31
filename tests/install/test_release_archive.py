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


def downloaded_script(scratch: Scratch):
    folder = scratch.project.parent / "download"
    folder.mkdir()
    shutil.copy(INSTALL, folder / "install.sh")
    return folder / "install.sh"


def run(scratch: Scratch, script) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", str(script)], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def test_a_script_with_no_code_beside_it_unpacks_the_releases_archive_into_the_projects_journal_src(tmp_path):
    scratch = Scratch(tmp_path)
    release_with_archive(scratch)
    install_run = run(scratch, downloaded_script(scratch))
    assert install_run.returncode == 0, install_run.stderr
    assert (scratch.journal / "src" / "core" / "journal.py").is_file() and (scratch.journal / "version-5.db").is_file()


def test_an_archive_whose_checksum_differs_from_the_releases_is_not_installed(tmp_path):
    scratch = Scratch(tmp_path)
    release_with_archive(scratch, listed_checksum="0" * 64)
    install_run = run(scratch, downloaded_script(scratch))
    assert install_run.returncode == 1 and "does not match" in install_run.stderr
    assert not scratch.journal.exists()


def test_a_release_with_no_archive_stops_the_install_and_says_so(tmp_path):
    scratch = Scratch(tmp_path)
    install_run = run(scratch, downloaded_script(scratch))
    assert install_run.returncode == 1 and "the release has no agent-journal.tar.gz" in install_run.stderr


STRAY_NAMES = ("version-4.bak", "d1short.txt", "d2.txt", "journal.db", "notes.orig", ".DS_Store", "cart.py.swp", "__pycache__", "node_modules", "viewer/tests")


def test_the_archive_the_release_script_packs_holds_what_the_release_runs_and_no_stray_file(tmp_path):
    checkout = INSTALL.parent
    dist_folder = tmp_path / "dist"
    subprocess.run(["sh", str(checkout / "scripts" / "build_archive.sh"), str(dist_folder)], cwd=checkout, check=True, capture_output=True, timeout=TIMEOUT_SECONDS)
    names = subprocess.run(["tar", "-tzf", str(dist_folder / ARCHIVE)], capture_output=True, text=True, check=True, timeout=TIMEOUT_SECONDS).stdout.splitlines()
    assert "src/core/journal.py" in names and "src/install/hook.sh" in names
    assert not [name for name in names if any(stray in name for stray in STRAY_NAMES) or name.endswith((".pyc", ".bak", ".orig", ".swp", "~"))], names[:5]
    sums = (dist_folder / "checksums.txt").read_text().splitlines()
    assert sum(line.endswith(f"  {ARCHIVE}") for line in sums) == 1
    subprocess.run(["sh", str(checkout / "scripts" / "build_archive.sh"), str(dist_folder)], cwd=checkout, check=True, capture_output=True, timeout=TIMEOUT_SECONDS)
    assert sum(line.endswith(f"  {ARCHIVE}") for line in (dist_folder / "checksums.txt").read_text().splitlines()) == 1
