import sqlite3
from pathlib import Path

from tests.stories.engine.upgrade.support.move_samples import ORDER, PATH
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_absent_exists_version_four, expect_answers, expect_bytes_database_home, expect_changed_code_outcome, expect_outcome_with, expect_value

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


from tests.integration.support.upgrade_steps import content, expect_count, expect_refusal, expect_table_counts, expect_upgrade, expect_upgrade_code, line_value, upgrade, upgrading


def test_the_upgrade_copies_the_version_4_database_into_the_backup_folder_first_and_checks_the_copy(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    starting_content = content(version_four)
    outcome = expect_upgrade(story)
    expect_content_3(outcome, "backup: ", starting_content)
    expect_outcome_with(outcome, "backup checked")


def test_a_failed_run_still_leaves_the_backup(journal_with):
    story, version_four = upgrading(journal_with, NOTES, RETRYABLE_TAGS)
    outcome = upgrade(story)
    expect_changed_code_outcome(outcome, 0)
    expect_outcome_with(outcome, "the move of movetags failed: the tags table could not be read")
    expect_path_rglob_folder("journal.db", version_four, story, "*")


def test_the_version_4_database_is_opened_read_only_and_its_bytes_are_equal_after(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    original = version_four.read_bytes()
    expect_upgrade(story)
    expect_bytes_folder_home_2(story, "version-4", "journal.db", original)


def test_a_dry_run_prints_the_counts_per_module_and_per_dropped_table_and_leaves_the_version_5_database_as_it_was(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    story.database.connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    starting_bytes = story.home.database.read_bytes()
    expect_upgrade(story, "dry run: nothing was changed", "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0", "dropped note_drafts: 1 rows", dry_run=True)
    story.database.connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    expect_bytes_database_home(story, starting_bytes)
    expect_count(story, "notes", 0)


def test_a_run_moves_every_declared_module_in_order(journal_with):
    story, version_four = upgrading(journal_with, TAGS, NOTES)
    expect_upgrade(story, "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0", "upgraded")
    expect_value(ORDER, ["notes", "tags"])
    expect_table_counts(story, "notes", "tags", (2, 2))


def test_a_second_run_says_nothing_is_left_to_move_and_moves_nothing(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    upgrade(story)
    expect_upgrade(story, "nothing left to move")
    expect_table_counts(story, "notes", "tags", (2, 2))


def test_a_run_that_fails_in_the_tags_move_leaves_notes_moved_rolls_tags_back_and_a_rerun_finishes_from_tags(journal_with):
    story, version_four = upgrading(journal_with, NOTES, RETRYABLE_TAGS)
    expect_upgrade_code(story, 1)
    expect_table_counts(story, "notes", "tags", (2, 0))
    expect_upgrade(story, "movetags: moved 2, already moved 0")
    expect_table_counts(story, "notes", "tags", (2, 2))


def test_a_version_4_table_no_module_claims_is_listed_and_not_lost(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    expect_upgrade(story, "not claimed: old_reports (1 rows)")
    expect_bytes_folder_home_with(story, "version-4", "journal.db", b"a report")


def test_the_upgrade_of_an_empty_version_4_journal_works(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS, with_rows=False)
    expect_upgrade(story, "movenotes: moved 0, already moved 0", "upgraded")


def test_the_upgrade_of_a_project_with_no_version_4_journal_is_refused_with_what_it_looked_for(journal_with):
    story = journal_with(NOTES, TAGS)
    expect_refusal(story, "no version 4 journal: journal.db is not in")


def test_a_resume_after_a_failure_keeps_the_first_backup_and_ignores_rows_added_to_version_4_since(journal_with):
    story, version_four = upgrading(journal_with, NOTES, RETRYABLE_TAGS)
    first = upgrade(story)
    expect_row(first, code=1)
    backups = [path for path in story.home.folder.rglob("journal.db") if path != version_four]
    expect_answers(backups, 1)
    original = content(backups[0])
    connection = sqlite3.connect(version_four)
    connection.execute("INSERT INTO notes VALUES (11, 'Added after the first run')")
    connection.commit()
    connection.close()
    expect_upgrade(story, "movetags: moved 2, already moved 0", "upgraded")
    expect_content(backups[0], original)
    expect_count(story, "notes", 2)


def test_after_a_good_upgrade_version_4s_files_are_in_version_4_with_the_backup_and_only_version_5_is_live(journal_with):
    story, version_four = upgrading(journal_with, NOTES, TAGS)
    (story.home.folder / "src" / "journal").mkdir(parents=True)
    (story.home.folder / "src" / "journal" / "version.py").write_text('VERSION = "4.28.0"\n')
    outcome = expect_upgrade(story)
    expect_absent_exists_version_four(version_four)
    expect_absent_exists_folder_home_2(story, "src", "journal")
    expect_file_folder_home_2(story, "version-4", "journal.db")
    expect_file_folder_home_3(story, "version-4", "src", "journal", "version.py")
    expect_file_folder_home(story, "version-4", "4.28.0", "journal.db")
    expect_outcome_with(outcome, "version 4's files moved into")
    expect_file_database_home(story)


def test_a_dropped_table_is_reported_and_stays_in_the_backup(journal_with):
    from tests.stories.fixtures.version_four import version_four_fixture

    story = journal_with()
    version_four_fixture(story.home.folder / "journal.db")
    outcome = expect_upgrade(story, "dropped collections: 1 rows")
    expect_outcome_with(outcome, "old_reports (1 rows)")
    expect_fetchone_execute_connect(story, "version-4", "journal.db", "SELECT count(*) FROM collections", 1)


def test_a_module_added_later_runs_its_move_on_a_second_upgrade_from_the_retired_database(journal_with):
    import json

    from tests.stories.fixtures.version_four import version_four_fixture

    story = journal_with()
    version_four_fixture(story.home.folder / "journal.db")
    expect_upgrade(story, "upgraded")
    story.home.module_list.write_text(json.dumps([NOTES]))
    sqlite3.connect(story.home.folder / "version-4" / "journal.db").executescript("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT); INSERT INTO notes VALUES (7, 'First');")
    expect_upgrade(story, "movenotes: moved 1, already moved 0", "upgraded")
    expect_count(story, "notes", 1)
    expect_upgrade(story, "nothing left to move")


def expect_content(path: Path, expected) -> None:
    actual = content(path)
    assert actual == expected, actual


def expect_fetchone_execute_connect(story, text, text_2, text_3, expected) -> None:
    actual = sqlite3.connect(next((story.home.folder / text).rglob(text_2))).execute(text_3).fetchone()[0]
    assert actual == expected, actual


def expect_file_database_home(story) -> None:
    actual = story.home.database.is_file()
    assert actual, actual


def expect_file_folder_home(story, text, text_2, text_3) -> None:
    actual = (story.home.folder / text / text_2 / text_3).is_file()
    assert actual, actual


def expect_file_folder_home_2(story, text, text_2) -> None:
    actual = (story.home.folder / text / text_2).is_file()
    assert actual, actual


def expect_file_folder_home_3(story, text, text_2, text_3, text_4) -> None:
    actual = (story.home.folder / text / text_2 / text_3 / text_4).is_file()
    assert actual, actual


def expect_absent_exists_folder_home_2(story, text, text_2) -> None:
    actual = (story.home.folder / text / text_2).exists()
    assert not actual, actual


def expect_bytes_folder_home_with(story, text, text_2, expected) -> None:
    actual = (story.home.folder / text / text_2).read_bytes()
    assert expected in actual, actual


def expect_bytes_folder_home_2(story, text, text_2, expected) -> None:
    actual = (story.home.folder / text / text_2).read_bytes()
    assert actual == expected, actual


def expect_path_rglob_folder(text, version_four, story, text_2) -> None:
    actual = any((path.name == text and path != version_four and (content(path) == content(version_four)) for path in story.home.folder.rglob(text_2)))
    assert actual, actual


def expect_content_3(outcome, text, expected) -> None:
    actual = content(Path(line_value(outcome.text, text)))
    assert actual == expected, actual
