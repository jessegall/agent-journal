from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_notice_keeps_its_title_link_and_button_and_a_closed_one_stays_closed(new_story):
    story = upgraded_story(new_story)
    story.expect_text("notice list --environment main", "Build is red: https://ci.example.org/build/7")
    story.expect_absent("notice list --environment main", "Old report")
    assert "journal.core.notices: moved 2" in story.upgrade_text
