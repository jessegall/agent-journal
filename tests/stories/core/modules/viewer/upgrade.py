from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_the_pairing_codes_of_version_4_are_dropped_named_and_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped phone_codes: 1 rows" in story.upgrade_text


def test_a_table_no_module_claims_is_still_listed(new_story):
    story = upgraded_story(new_story)
    assert "not claimed: old_reports (1 rows)" in story.upgrade_text
