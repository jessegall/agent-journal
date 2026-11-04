from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_a_version_4_pin_keeps_its_title_link_and_button_and_a_closed_one_stays_closed(new_story):
    story = upgraded_story(new_story)
    story.expect_text("pin list --environment main", "Build is red: https://ci.example.org/build/7")
    story.expect_absent("pin list --environment main", "Old report")
    expect_upgrade_text(story, "journal.core.pins: moved 2")
