from pathlib import Path

from core.base.database.database import Database
from core.base.database.statement import Statement
from tests.stories.core.upgrade.support.move_samples import FAILURES, ORDER, PATH, version_four_database

NOTES, TAGS, FAILS_ONCE = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:FailsOnceTagsModule"


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) AS total FROM {table}"))[0]["total"]


def upgrading(new_story, *modules: str, with_rows: bool = True):
    story = new_story(*modules)
    ORDER.clear()
    FAILURES["tags"] = 0
    return story, version_four_database(story.home.folder, "journal.db", with_rows)


def line_value(text: str, label: str) -> str:
    return next(line.split(label, 1)[1].strip() for line in text.splitlines() if line.startswith(label))


def test_the_upgrade_copies_the_version_4_database_into_the_backup_folder_first_and_checks_the_copy(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()
    outcome = story.run("upgrade")
    assert outcome.code == 0, outcome.output_text
    assert Path(line_value(outcome.output_text, "backup: ")).read_bytes() == original and "backup checked" in outcome.output_text


def test_a_failed_run_still_leaves_the_backup(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    original = version_four.read_bytes()
    outcome = story.run("upgrade")
    assert outcome.code != 0 and "the move of movetags failed: the tags table could not be read" in outcome.output_text
    assert any(path.read_bytes() == original for path in story.home.folder.rglob("*") if path.is_file() and path != version_four)


def test_the_version_4_database_is_opened_read_only_and_its_bytes_are_equal_after(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    original = version_four.read_bytes()
    story.expect_success("upgrade")
    assert version_four.read_bytes() == original


def test_a_dry_run_prints_the_counts_per_module_and_per_dropped_table_and_leaves_the_version_5_database_as_it_was(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    before = story.home.database.read_bytes()
    story.expect_success("upgrade --dry-run", "dry run: nothing was changed", "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0",
                         "dropped note_drafts: 1 rows")
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    assert story.home.database.read_bytes() == before and count(story, "notes") == 0


def test_a_run_moves_every_declared_module_in_order(new_story):
    story, version_four = upgrading(new_story, TAGS, NOTES)
    story.expect_success("upgrade", "movenotes: moved 2, already moved 0", "movetags: moved 2, already moved 0", "upgraded")
    assert ORDER == ["notes", "tags"] and (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_second_run_says_already_upgraded_and_moves_nothing(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    story.run("upgrade")
    story.expect_success("upgrade", "already upgraded")
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_run_that_fails_in_the_tags_move_leaves_notes_moved_rolls_tags_back_and_a_rerun_finishes_from_tags(new_story):
    story, version_four = upgrading(new_story, NOTES, FAILS_ONCE)
    story.expect_refusal("upgrade", "the move of movetags failed")
    assert (count(story, "notes"), count(story, "tags")) == (2, 0)
    story.expect_success("upgrade", "movetags: moved 2")
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_version_4_table_no_module_claims_is_listed_and_not_lost(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS)
    story.expect_success("upgrade", "not claimed: old_reports (1 rows)")
    assert version_four.exists() and b"a report" in version_four.read_bytes()


def test_the_upgrade_of_an_empty_version_4_journal_works(new_story):
    story, version_four = upgrading(new_story, NOTES, TAGS, with_rows=False)
    story.expect_success("upgrade", "movenotes: moved 0, already moved 0", "upgraded")


def test_the_upgrade_of_a_project_with_no_version_4_journal_is_refused_with_what_it_looked_for(new_story):
    story = new_story(NOTES, TAGS)
    story.expect_refusal("upgrade", "no version 4 journal: journal.db is not in")
