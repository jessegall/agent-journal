from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_the_pairing_codes_of_version_4_are_dropped_named_and_counted(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "dropped phone_codes: 1 rows")


def test_a_table_no_module_claims_is_still_listed(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "not claimed: old_reports (1 rows)")


def test_a_saved_layout_becomes_a_layout_of_the_person_in_window_names_and_a_view_with_no_window_stays_as_a_gone_one(new_story):
    story = upgraded_story(new_story)
    shown = story.run("viewer-layout list")
    shown.expect_text("messages.chat")
    shown.expect_text("tasks.tasks")
    shown.expect_text("gone.weather")
    expect_join_without("\n", story, "layout", "skipped settings")


def expect_join_without(text, story, text_2, expected) -> None:
    actual = text.join((line for line in story.upgrade_text.splitlines() if text_2 in line))
    assert expected not in actual, actual
