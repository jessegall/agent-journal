from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_setting_a_module_declares_moves_under_its_full_name_with_its_value(new_story):
    story = upgraded_story(new_story)
    story.expect_success("setting list", "journal.core.memories.keyword-limit")


def test_a_setting_no_module_declares_is_skipped_with_its_number_and_reason(new_story):
    story = upgraded_story(new_story)
    assert "skipped settings 2: no module declares the key no.such.key" in story.upgrade_text
