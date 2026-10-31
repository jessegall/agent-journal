import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.upgrade_failed import UpgradeFailed
from core.base.upgrade.move_runner import MoveRunner
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.core.upgrade.support.move_samples import ORDER, PATH, version_four_database

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
    assert ORDER == ["notes", "tags"]


def test_the_moved_rows_arrive_and_the_map_records_each_with_its_version_4_and_version_5_table_and_id(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    report = upgrade.run(source)
    assert (count(story, "notes"), count(story, "tags")) == (2, 2) and sample(report.moved) == {"movenotes": 2, "movetags": 2} and sample(report.dropped) == {"movenotes": 1, "movetags": 0}
    moved = MoveMap(story.container.get(Database))
    first = moved.new_id("notes", 7)
    assert first is not None and moved.new_id("tags", 1) is not None and moved.new_id("notes", 8) is None
    assert story.container.get(Database).rows(Statement("SELECT note_id FROM tags WHERE label = 'red'"))[0][0] == first


def test_a_second_run_skips_every_row_the_map_holds(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    upgrade.run(source)
    again = upgrade.run(source)
    assert sample(again.moved) == {"movenotes": 0, "movetags": 0} and sample(again.repeated) == {"movenotes": 2, "movetags": 2}
    assert (count(story, "notes"), count(story, "tags")) == (2, 2)


def test_a_move_that_raises_rolls_back_its_modules_rows_and_leaves_the_earlier_modules_in_place(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, BROKEN_TAGS)
    with pytest.raises(UpgradeFailed, match="the move of movetags failed: the second tag could not be read"):
        upgrade.run(source)
    assert (count(story, "notes"), count(story, "tags")) == (2, 0)
    moved = MoveMap(story.container.get(Database))
    assert moved.new_id("notes", 7) is not None and moved.new_id("tags", 1) is None


def test_a_version_4_table_no_module_claims_is_listed(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    assert upgrade.run(source).unclaimed == {"old_reports": 1}


def test_a_dry_run_gives_the_real_counts_and_leaves_nothing_behind(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    report = upgrade.run(source, dry_run=True)
    assert sample(report.moved) == {"movenotes": 2, "movetags": 2}
    assert (count(story, "notes"), count(story, "tags")) == (0, 0) and MoveMap(story.container.get(Database)).count() == 0
    assert sample(upgrade.run(source).moved) == {"movenotes": 2, "movetags": 2}


def test_a_dry_run_leaves_the_database_file_byte_equal(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    before = story.home.database.read_bytes()
    upgrade.run(source, dry_run=True)
    story.container.get(Database).connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    assert story.home.database.read_bytes() == before


def test_the_version_4_database_is_never_written_by_a_run(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    before = source.read_bytes()
    upgrade.run(source)
    assert source.read_bytes() == before


def test_moved_rows_write_one_upgrade_moved_event_per_module_and_no_event_of_their_own(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    upgrade.run(source)
    rows = story.container.get(Database).rows(Statement("SELECT name, data FROM events ORDER BY id"))
    names = [row["name"] for row in rows]
    moved = [row["data"] for row in rows if row["name"] == "upgrade.moved"]
    assert len(moved) == len(set(moved)) and sum('"module": [null, "movenotes"]' in data for data in moved) == 1 and sum('"module": [null, "movetags"]' in data for data in moved) == 1
    assert "note.create" not in names and "tag.create" not in names and any('"moved": {"notes": 2}' in data for data in moved)
    assert story.container.get(Database).rows(Statement("SELECT count(*) AS total FROM chat_marks"))[0]["total"] == 0
