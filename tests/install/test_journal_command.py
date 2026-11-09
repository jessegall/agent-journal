import subprocess

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch
from tests.install.test_upgrade_script import version_four_project


def shim_environment(scratch: Scratch) -> dict[str, str]:
    return {**scratch.environment(), "PATH": f"{scratch.home / '.local' / 'bin'}:{scratch.environment()['PATH']}"}


def install(scratch: Scratch, *arguments: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", str(INSTALL), *arguments], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def run_journal(scratch: Scratch, folder, environment=None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["journal", "overview"], cwd=folder, env=environment or shim_environment(scratch), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)


def put_version_five_command(scratch: Scratch) -> None:
    command = scratch.journal / "bin" / "journal"
    command.parent.mkdir(parents=True, exist_ok=True)
    command.write_text('#!/bin/sh\necho "version 5 journal $*"\n')
    command.chmod(0o755)


def test_an_upgraded_version_4_project_runs_its_version_5_journal_through_the_shim_and_through_its_own_link(tmp_path):
    scratch = version_four_project(tmp_path)
    install(scratch, "upgrade", "--yes")
    assert (scratch.journal / "version-5.db").is_file() and not (scratch.journal / "journal.db").exists()
    put_version_five_command(scratch)
    deep = scratch.project / "src" / "cart"
    deep.mkdir(parents=True)
    assert run_journal(scratch, scratch.project).stdout.strip() == "version 5 journal overview"
    assert run_journal(scratch, deep).stdout.strip() == "version 5 journal overview"
    linked = subprocess.run([str(scratch.journal / "journal"), "overview"], cwd=scratch.project, env=scratch.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
    assert linked.stdout.strip() == "version 5 journal overview"


def test_a_plain_install_leaves_the_link_and_the_shim(tmp_path):
    scratch = Scratch(tmp_path)
    install(scratch)
    assert (scratch.journal / "journal").is_file() and (scratch.journal / "journal").stat().st_mode & 0o111
    assert (scratch.home / ".local" / "bin" / "journal").stat().st_mode & 0o111


def test_the_shim_still_runs_a_version_4_project_and_says_so_when_there_is_no_project(tmp_path):
    scratch = Scratch(tmp_path)
    install(scratch)
    old = tmp_path / "old"
    (old / ".journal" / "src").mkdir(parents=True)
    (old / ".journal" / "src" / "journal.sh").write_text('echo "version 4 journal $*"\n')
    assert run_journal(scratch, old).stdout.strip() == "version 4 journal overview"
    missing_place = tmp_path / "nowhere"
    missing_place.mkdir()
    missing = run_journal(scratch, missing_place)
    assert missing.returncode == 1 and "no .journal/ here or above" in missing.stderr
