import sqlite3

from tests.install.support import Scratch


def test_install_in_an_empty_project_makes_a_version_5_database_synced_from_the_core_modules(tmp_path):
    scratch = Scratch(tmp_path)
    run = scratch.install()
    assert run.returncode == 0, run.stderr
    database = scratch.journal / "version-5.db"
    assert database.is_file() and {"tasks", "agents", "registry"} <= scratch.tables(database)
    assert (scratch.journal / "src" / "core" / "journal.py").is_file()
    assert not (scratch.journal / "journal.db").exists()


def test_install_writes_the_hooks_of_claude_code_and_codex(tmp_path):
    scratch = Scratch(tmp_path)
    assert scratch.install().returncode == 0
    assert (scratch.project / ".claude" / "settings.local.json").is_file() and (scratch.project / ".codex" / "hooks.json").is_file()
    assert not any(scratch.home.iterdir())


def test_install_starts_nothing_the_person_did_not_ask_for(tmp_path):
    scratch = Scratch(tmp_path)
    assert scratch.install().returncode == 0
    files = {path.name for path in scratch.journal.rglob("*")}
    assert not any(name.endswith(".sock") or name.endswith(".pid") for name in files)
    assert not (scratch.journal / "runtime").exists() or not any((scratch.journal / "runtime").iterdir())


def test_install_run_again_changes_nothing_and_says_so(tmp_path):
    scratch = Scratch(tmp_path)
    assert scratch.install().returncode == 0
    before = scratch.snapshot()
    again = scratch.install()
    assert again.returncode == 0, again.stderr
    assert "already installed" in again.stdout and "nothing changed" in again.stdout
    assert scratch.snapshot() == before


def test_python_older_than_3_14_is_refused_with_the_way_to_get_it(tmp_path):
    scratch = Scratch(tmp_path)
    scratch.with_python("3.13.2")
    run = scratch.install()
    assert run.returncode == 1
    assert "Python 3.14 or newer" in run.stderr and "https://www.python.org/downloads" in run.stderr
    assert not scratch.journal.exists() and not (scratch.project / ".claude").exists()


def test_a_project_with_a_version_4_journal_is_not_touched_and_is_told_to_upgrade(tmp_path):
    scratch = Scratch(tmp_path)
    scratch.journal.mkdir()
    old = scratch.journal / "journal.db"
    connection = sqlite3.connect(old)
    connection.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)")
    connection.commit()
    connection.close()
    before = scratch.snapshot()
    run = scratch.install()
    assert run.returncode == 1
    assert "this project holds a version 4 journal: run journal upgrade" in run.stderr
    assert scratch.snapshot() == before
