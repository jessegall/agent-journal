import sqlite3
from pathlib import Path

from core.base.database.database import Database
from core.base.database.statement import Statement
from install.upgrade_journal import UpgradeJournal
from install.upgrade_outcome import UpgradeOutcome
from tests.stories.core.upgrade.support.move_samples import FAILURES, ORDER, PATH, version_four_database

NOTES, TAGS, FAILS_ONCE = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:FailsOnceTagsModule"


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) AS total FROM {table}"))[0]["total"]


def upgrading(new_story, *modules: str, with_rows: bool = True):
    story = new_story(*modules)
    ORDER.clear()
    FAILURES["tags"] = 0
    return story, version_four_database(story.home.folder, "journal.db", with_rows)


def upgrade(story, dry_run: bool = False, confirmed: bool = True) -> UpgradeOutcome:
    return UpgradeJournal(story.home).run(dry_run=dry_run, confirmed=confirmed)


def expect_upgrade(story, *lines: str, dry_run: bool = False) -> UpgradeOutcome:
    outcome = upgrade(story, dry_run)
    assert outcome.code == 0, outcome.text
    missing = [line for line in lines if line not in outcome.text.splitlines()]
    assert not missing, f"{missing} not in {outcome.text}"
    return outcome


def expect_refusal(story, text: str) -> None:
    outcome = upgrade(story)
    assert outcome.code == 1 and text in outcome.text, outcome


def content(path: Path) -> list[str]:
    connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
    try:
        return list(connection.iterdump())
    finally:
        connection.close()


def line_value(text: str, label: str) -> str:
    return next(line.split(label, 1)[1].strip() for line in text.splitlines() if line.startswith(label))


def test_the_upgrade_copies_the_version_4_database_into_the_backup_folder_first_and_checks_the_copy(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    before = content(version_four)
    outcome = expect_upgrade(story)
    assert content(Path(line_value(outcome.text, "backup: "))) == before and "backup checked" in outcome.text


def test_a_failed_run_still_leaves_the_backup(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    outcome = upgrade(story)
    assert outcome.code != 0 and "the move of movetags failed: the tags table could not be read" in outcome.text
    assert any(path.name == "journal.db" and path != version_four and content(path) == content(version_four) for path in story.home.folder.rglob("*"))


def test_the_version_4_database_is_opened_read_only_and_its_bytes_are_equal_after(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()
    expect_upgrade(story)
    assert (story.home.folder / "version-4" / "journal.db").read_bytes() == original


def test_a_dry_run_prints_the_counts_per_module_and_per_dropped_table_and_leaves_the_version_5_database_as_it_was(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    before = story.home.database.read_bytes()
    expect_upgrade(story, "dry run: nothing was changed", "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0", "dropped note_drafts: 1 rows", dry_run=True)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    assert story.home.database.read_bytes() == before and count(story, "notes") == 0


def test_a_run_moves_every_declared_module_in_order(new_story):
    story, version_four = upgrading(new_story, TAGS, NOTES)
    expect_upgrade(story, "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0", "upgraded")
    assert ORDER == ["notes", "tags"] and (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_second_run_says_nothing_is_left_to_move_and_moves_nothing(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    upgrade(story)
    expect_upgrade(story, "nothing left to move")
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_run_that_fails_in_the_tags_move_leaves_notes_moved_rolls_tags_back_and_a_rerun_finishes_from_tags(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    assert upgrade(story).code == 1
    assert (count(story, "notes"), count(story, "tags")) == (2, 0)
    expect_upgrade(story, "movetags: moved 2, already moved 0")
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_version_4_table_no_module_claims_is_listed_and_not_lost(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    expect_upgrade(story, "not claimed: old_reports (1 rows)")
    assert b"a report" in (story.home.folder / "version-4" / "journal.db").read_bytes()


def test_the_upgrade_of_an_empty_version_4_journal_works(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS, with_rows=False)
    expect_upgrade(story, "movenotes: moved 0, already moved 0", "upgraded")


def test_the_upgrade_of_a_project_with_no_version_4_journal_is_refused_with_what_it_looked_for(new_story):
    story = new_story(NOTES, TAGS)
    expect_refusal(story, "no version 4 journal: journal.db is not in")


def test_a_resume_after_a_failure_keeps_the_first_backup_and_ignores_rows_added_to_version_4_since(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    first = upgrade(story)
    assert first.code == 1
    backups = [path for path in story.home.folder.rglob("journal.db") if path != version_four]
    assert len(backups) == 1
    original = content(backups[0])
    connection = sqlite3.connect(version_four)
    connection.execute("INSERT INTO notes VALUES (11, 'Added after the first run')")
    connection.commit()
    connection.close()
    expect_upgrade(story, "movetags: moved 2, already moved 0", "upgraded")
    assert content(backups[0]) == original and count(story, "notes") == 2


def test_after_a_good_upgrade_version_4s_files_are_in_version_4_with_the_backup_and_only_version_5_is_live(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    (story.home.folder / "src" / "journal").mkdir(parents=True)
    (story.home.folder / "src" / "journal" / "version.py").write_text('VERSION = "4.28.0"\n')
    outcome = expect_upgrade(story)
    assert not version_four.exists() and not (story.home.folder / "src" / "journal").exists()
    assert (story.home.folder / "version-4" / "journal.db").is_file() and (story.home.folder / "version-4" / "src" / "journal" / "version.py").is_file()
    assert (story.home.folder / "version-4" / "4.28.0" / "journal.db").is_file() and "version 4's files moved into" in outcome.text
    assert story.home.database.is_file()


def test_a_table_whose_module_is_not_built_is_listed_as_waiting_and_stays_in_the_backup(new_story):
    from tests.stories.fixtures.version_four import version_four_fixture

    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    outcome = expect_upgrade(story, "not claimed: sequences (1 rows); waits for its module and stays in the backup")
    assert "old_reports (1 rows)" in outcome.text and "waits" not in next(line for line in outcome.text.splitlines() if "old_reports" in line)
    assert sqlite3.connect(next((story.home.folder / "version-4").rglob("journal.db"))).execute("SELECT count(*) FROM sequences").fetchone()[0] == 1


def test_a_module_added_later_runs_its_move_on_a_second_upgrade_from_the_retired_database(new_story):
    import json

    from tests.stories.fixtures.version_four import version_four_fixture

    story = new_story()
    version_four_fixture(story.home.folder / "journal.db")
    expect_upgrade(story, "upgraded")
    story.home.module_list.write_text(json.dumps([NOTES]))
    sqlite3.connect(story.home.folder / "version-4" / "journal.db").executescript("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT); INSERT INTO notes VALUES (7, 'First');")
    expect_upgrade(story, "movenotes: moved 1, already moved 0", "upgraded")
    assert count(story, "notes") == 1
    expect_upgrade(story, "nothing left to move")
