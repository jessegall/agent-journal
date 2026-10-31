from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_version_4_phones_are_left_in_the_backup_and_the_report_says_to_pair_them_again(new_story):
    story = upgraded_story(new_story)
    assert "dropped phones: 1 rows" in story.upgrade_text
    assert "pair each phone again from the Phones window" in story.upgrade_text
