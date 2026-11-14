from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story


def test_version_4_counts_move_with_their_keys_and_values(new_story):
    story = upgraded_story(new_story)
    story.expect_text("statistic list", "profiles.designer.uses  18", "verification.merges.5  14")


def test_the_counts_are_listed_by_the_start_of_their_key(new_story):
    story = upgraded_story(new_story)
    story.expect_text("statistic list --prefix profiles.", "profiles.designer.last_used  1793381111")
    story.expect_absent("statistic list --prefix profiles.", "verification.merges.5  14")
