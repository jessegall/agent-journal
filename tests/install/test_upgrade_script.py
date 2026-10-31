import sqlite3
import subprocess

from tests.install.support import INSTALL, TIMEOUT_SECONDS, Scratch
from tests.stories.fixtures.version_four import version_four_fixture


def version_four_project(tmp_path) -> Scratch:
    scratch = Scratch(tmp_path)
    scratch.journal.mkdir()
    version_four_fixture(scratch.journal / "journal.db")
    return scratch


def upgrade(scratch: Scratch, *flags: str, answer: str = "") -> subprocess.CompletedProcess[str]:
    return subprocess.run(["sh", str(INSTALL), "upgrade", *flags], cwd=scratch.project, env=scratch.environment(), input=answer, capture_output=True, text=True,
                          timeout=TIMEOUT_SECONDS)


def content(path) -> list[str]:
    connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
    try:
        return list(connection.iterdump())
    finally:
        connection.close()


def test_the_upgrade_of_a_version_4_project_makes_version_5_live_and_moves_version_4s_database_with_its_backup_unchanged(tmp_path):
    scratch = version_four_project(tmp_path)
    version_four_bytes = content(scratch.journal / "journal.db")
    run = upgrade(scratch, "--yes")
    assert run.returncode == 0, run.stdout + run.stderr
    assert "upgraded" in run.stdout and "not claimed: sequences (1 rows)" in run.stdout
    assert (scratch.journal / "version-5.db").is_file() and (scratch.journal / "src" / "core" / "journal.py").is_file()
    assert not (scratch.journal / "journal.db").exists() and content(scratch.journal / "version-4" / "journal.db") == version_four_bytes
    assert content(next((scratch.journal / "version-4").rglob("journal.db"))) == version_four_bytes


def test_a_dry_run_prints_the_counts_and_changes_nothing(tmp_path):
    scratch = version_four_project(tmp_path)
    starting_files = scratch.snapshot()
    run = upgrade(scratch, "--dry-run")
    assert run.returncode == 0, run.stdout + run.stderr
    assert "dry run: nothing was changed" in run.stdout and "not claimed: sequences (1 rows)" in run.stdout
    assert scratch.snapshot() == starting_files


def test_without_yes_it_prints_the_counts_asks_once_and_a_no_changes_nothing(tmp_path):
    scratch = version_four_project(tmp_path)
    starting_files = scratch.snapshot()
    run = upgrade(scratch, answer="n\n")
    assert run.returncode == 0 and "move these rows into version 5?" in run.stdout and "dry run: nothing was changed" in run.stdout
    assert scratch.snapshot() == starting_files


def test_a_project_without_a_version_4_journal_is_told_so(tmp_path):
    scratch = Scratch(tmp_path)
    run = upgrade(scratch, "--yes")
    assert run.returncode == 1 and "no version 4 journal: journal.db is not in" in run.stdout


def test_the_upgrade_is_refused_while_a_server_answers_and_says_how_to_stop_it(tmp_path):
    from install.upgrade_journal import UpgradeJournal
    from tests.install.support import LiveJournal

    live = LiveJournal(tmp_path)
    try:
        version_four_fixture(live.home.folder / "journal.db")
        live.start_server()
        live.wait_healthy()
        outcome = UpgradeJournal(live.home).run(confirmed=True)
        assert outcome.code == 1 and "a journal server answers" in outcome.text and "journal server stop" in outcome.text
    finally:
        live.close()
