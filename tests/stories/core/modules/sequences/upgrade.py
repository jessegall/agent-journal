from tests.stories.core.base.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story


def test_a_version_4_sequence_keeps_its_number_and_each_step_as_its_title_and_instructions(new_story):
    story = upgraded_story(new_story)
    story.expect_ordered_lines("sequence show 1", "sequence 1: Release steps", "1. Run the suite: all of it", "2. Tag it")
    assert "journal.core.sequences: moved 1" in story.upgrade_text


def test_a_second_upgrade_moves_no_sequence_again(new_story):
    story = upgraded_story(new_story)
    assert "nothing left to move" in repeated_upgrade(story).text
