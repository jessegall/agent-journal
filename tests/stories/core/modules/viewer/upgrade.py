from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_the_pairing_codes_of_version_4_are_dropped_named_and_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped phone_codes: 1 rows" in story.upgrade_text


def test_a_table_no_module_claims_is_still_listed(new_story):
    story = upgraded_story(new_story)
    assert "not claimed: old_reports (1 rows)" in story.upgrade_text


def test_a_saved_layout_becomes_a_layout_of_the_person_in_window_names_and_a_view_with_no_window_stays_as_a_gone_one(new_story):
    story = upgraded_story(new_story)
    shown = story.run("viewer-layout list").output_text
    assert "messages.chat" in shown and "tasks.tasks" in shown and "gone.weather" in shown
    assert "skipped settings" not in "\n".join(line for line in story.upgrade_text.splitlines() if "layout" in line)
