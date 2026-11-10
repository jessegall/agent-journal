from tests.stories.engine.upgrade.support.fixture_upgrade import repeated_upgrade, upgraded_story, expect_upgrade_text


def test_a_second_upgrade_moves_no_sequence_again(new_story):
    story = upgraded_story(new_story)
    expect_repeated_upgrade_with(story, "nothing left to move")


def test_a_sequence_whose_triggers_or_guards_do_not_read_is_skipped_and_told(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "nonsense is no type of trigger")
    expect_upgrade_text(story, "does not read")
    story.expect_success("sequence list")
    story.expect_absent("sequence list", "Broken")


def expect_repeated_upgrade_with(story, expected) -> None:
    actual = repeated_upgrade(story).text
    assert expected in actual, actual
