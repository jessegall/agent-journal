import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.upgrade.move_map import MoveMap
from engine.upgrade.errors.upgrade_failed_error import UpgradeFailedError
from engine.upgrade.move_runner import MoveRunner
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.upgrade.support.move_samples import ORDER, PATH, version_four_database
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_bytes_database_home, expect_bytes_source, expect_changed_value, expect_value, expect_value_2, expect_value_line, expect_value_without
from tests.stories.engine.upgrade.upgrade import expect_table_counts

NOTES, TAGS, BROKEN_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:BrokenTagsModule"


def sample(counts: dict[str, int]) -> dict[str, int]:
    return {module: rows for module, rows in counts.items() if module.startswith("move")}


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]


def runner(new_story, tmp_path, *modules: str):
    story = new_story(*modules, fixture=MainEnvironment)
    ORDER.clear()
    return story, story.container.get(MoveRunner), version_four_database(tmp_path)


def test_the_runner_orders_the_moves_by_module_dependency_whatever_order_the_modules_are_named_in(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, TAGS, NOTES)
    upgrade.run(source)
    expect_value(ORDER, ["notes", "tags"])


def test_the_moved_rows_arrive_and_the_map_records_each_with_its_version_4_and_version_5_table_and_id(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    report = upgrade.run(source)
    expect_table_counts(story, "notes", "tags", (2, 2))
    expect_sample_2(report, {"movenotes": 2, "movetags": 2})
    expect_sample_3(report, {"movenotes": 1, "movetags": 0})
    moved = MoveMap(story.container.get(Database))
    first = moved.new_id("notes", 7)
    expect_changed_value(first, None)
    expect_changed_new_id_moved(moved, "tags", 1, None)
    expect_new_id_moved(moved, "notes", 8, None)
    expect_value_2(story, "SELECT note_id FROM tags WHERE label = 'red'", first)


def test_a_second_run_skips_every_row_the_map_holds(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    upgrade.run(source)
    second_run = upgrade.run(source)
    expect_sample(second_run.moved, {"movenotes": 0, "movetags": 0})
    expect_sample(second_run.repeated, {"movenotes": 2, "movetags": 2})
    expect_table_counts(story, "notes", "tags", (2, 2))


def test_a_move_that_raises_rolls_back_its_modules_rows_and_leaves_the_earlier_modules_in_place(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, BROKEN_TAGS)
    with pytest.raises(UpgradeFailedError, match="the move of movetags failed: the second tag could not be read"):
        upgrade.run(source)
    expect_table_counts(story, "notes", "tags", (2, 0))
    moved = MoveMap(story.container.get(Database))
    expect_changed_new_id_moved(moved, "notes", 7, None)
    expect_new_id_moved(moved, "tags", 1, None)


def test_a_version_4_table_no_module_claims_is_listed(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    expect_unclaimed_upgrade(upgrade, source, {"old_reports": 1})


def test_a_dry_run_gives_the_real_counts_and_leaves_nothing_behind(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    report = upgrade.run(source, dry_run=True)
    expect_sample(report.moved, {"movenotes": 2, "movetags": 2})
    expect_table_counts(story, "notes", "tags", (0, 0))
    expect_count_move_map(story, 0)
    expect_sample(upgrade.run(source).moved, {"movenotes": 2, "movetags": 2})


def test_a_dry_run_leaves_the_database_file_byte_equal(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    starting_bytes = story.home.database.read_bytes()
    upgrade.run(source, dry_run=True)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    expect_bytes_database_home(story, starting_bytes)


def test_the_version_4_database_is_never_written_by_a_run(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    starting_bytes = source.read_bytes()
    upgrade.run(source)
    expect_bytes_source(source, starting_bytes)


def test_moved_rows_write_one_upgrade_moved_event_per_module_and_no_event_of_their_own(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    upgrade.run(source)
    rows = story.container.get(Database).rows(Statement("SELECT name, data FROM events ORDER BY id"))
    names = [row["name"] for row in rows]
    moved = [row["data"] for row in rows if row["name"] == "upgrade.moved"]
    expect_sum_moved('"module": [null, "movenotes"]', moved, 1)
    expect_sum_moved('"module": [null, "movetags"]', moved, 1)
    expect_value_without(names, "note.create")
    expect_value_without(names, "tag.create")
    expect_value_line(moved, '"moved": {"notes": 2}')
    expect_row(story.container.get(Database).rows(Statement("SELECT count(*) AS total FROM chat_marks"))[0], total=0)


def expect_sample(counts: dict[str, int], expected) -> None:
    actual = sample(counts)
    assert actual == expected, actual


def expect_sum_moved(text, moved, expected) -> None:
    actual = sum((text in data for data in moved))
    assert actual == expected, actual


def expect_count_move_map(story, expected) -> None:
    actual = MoveMap(story.container.get(Database)).count()
    assert actual == expected, actual


def expect_unclaimed_upgrade(upgrade, source, expected) -> None:
    actual = upgrade.run(source).unclaimed
    assert actual == expected, actual


def expect_changed_new_id_moved(moved, text, number, expected) -> None:
    actual = moved.new_id(text, number)
    assert actual is not expected, actual


def expect_new_id_moved(moved, text, number, expected) -> None:
    actual = moved.new_id(text, number)
    assert actual is expected, actual


def expect_sample_2(report, expected) -> None:
    actual = sample(report.moved)
    assert actual == expected, actual


def expect_sample_3(report, expected) -> None:
    actual = sample(report.dropped)
    assert actual == expected, actual
