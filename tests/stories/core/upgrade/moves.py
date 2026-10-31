import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.upgrade_failed import UpgradeFailed
from core.base.upgrade.upgrade_runner import UpgradeRunner
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.core.upgrade.support.move_samples import ORDER, PATH, version_four_database

NOTES, TAGS, BROKEN_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:BrokenTagsModule"


def count(story, table: str) -> int:
    return story.container.get(Database).rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]


def runner(new_story, tmp_path, *modules: str):
    story = new_story(*modules, fixture=MainEnvironment)
    ORDER.clear()
    return story, story.container.get(UpgradeRunner), version_four_database(tmp_path)


def test_the_runner_orders_the_moves_by_module_dependency_whatever_order_the_modules_are_named_in(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, TAGS, NOTES)
    upgrade.run(source)
    assert ORDER == ["notes", "tags"]


def test_the_moved_rows_arrive_and_the_map_records_each_with_its_version_4_and_version_5_table_and_id(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    report = upgrade.run(source)
    assert (count(story, "notes"), count(story, "tags")) == (2, 2) and report.moved == {"movenotes": 2, "movetags": 2} and report.dropped == {"movenotes": 1, "movetags": 0}
    moved = MoveMap(story.container.get(Database))
    first = moved.new_id("notes", 7)
    assert first is not None and moved.new_id("tags", 1) is not None and moved.new_id("notes", 8) is None
    assert story.container.get(Database).rows(Statement("SELECT note_id FROM tags WHERE label = 'red'"))[0][0] == first


def test_a_second_run_skips_every_row_the_map_holds(new_story, tmp_path):
    story, upgrade, source = runner(new_story, tmp_path, NOTES, TAGS)
    upgrade.run(source)
    again = upgrade.run(source)
    assert again.moved == {"movenotes": 0, "movetags": 0} and again.repeated == {"movenotes": 2, "movetags": 2}
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
    assert upgrade.run(source).unclaimed == ("old_reports",)
