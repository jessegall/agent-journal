from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_suggestion_keeps_its_answer_so_it_is_not_offered_again(new_story):
    story = upgraded_story(new_story)
    story.expect_text("suggestion list", "Run Code Commandments as a plugin", "declined")
    assert "journal.core.suggestions: moved 1" in story.upgrade_text
