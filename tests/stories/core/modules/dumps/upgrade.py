from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_dump_moves_with_an_item_for_each_part_and_file_and_closes_with_its_outcome(new_story):
    story = upgraded_story(new_story)
    story.expect_text("dump show 1 --json", '"title": "Call notes"', '"outcome": "1 filed, 1 failed"')
    story.expect_text("dump items 1", "1: filed - made a task (tasks:1)", "2: failed - no date given", "3: noted - totals")


def test_a_dump_without_parts_has_one_item_of_its_whole_text_not_read_yet(new_story):
    story = upgraded_story(new_story)
    story.expect_text("dump items 2", "1: not read yet")
    story.expect_text("dump show 2", "Pasted text")


def test_the_dumps_row_count_is_two_and_the_one_of_a_removed_environment_is_skipped_and_named(new_story):
    story = upgraded_story(new_story)
    assert "journal.core.dumps: moved 2, already moved 0" in story.upgrade_text
    assert "skipped dumps 3: its environment did not move" in story.upgrade_text
    assert "dropped dump questions and logs: 1 rows" in story.upgrade_text
