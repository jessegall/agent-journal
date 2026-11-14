from tests.stories.engine.upgrade.support.fixture_upgrade import expect_upgrade_text


def test_version_4_phones_are_left_in_the_backup_and_the_report_says_to_pair_them_again(upgraded):
    story = upgraded
    expect_upgrade_text(story, "dropped phones: 1 rows")
    expect_upgrade_text(story, "pair each phone again from the Phones window")
