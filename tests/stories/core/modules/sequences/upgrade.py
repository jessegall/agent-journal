from tests.stories.core.base.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story


def test_a_version_4_sequence_keeps_its_number_and_each_step_as_its_title_and_instructions(new_story):
    story = upgraded_story(new_story)
    story.expect_ordered_lines("sequence show 1", "sequence 1: Release steps", "1. Run the suite: all of it", "2. Tag it")
    assert "journal.core.sequences: moved 1" in story.upgrade_text


def test_a_second_upgrade_moves_no_sequence_again(new_story):
    story = upgraded_story(new_story)
    assert "nothing left to move" in repeated_upgrade(story).text


def test_a_sequence_whose_triggers_or_guards_do_not_read_is_skipped_and_told(new_story):
    story = upgraded_story(new_story)
    assert "nonsense is no kind of trigger" in story.upgrade_text, story.upgrade_text
    assert "does not read" in story.upgrade_text, story.upgrade_text
    story.expect_success("sequence list")
    story.expect_absent("sequence list", "Broken")

