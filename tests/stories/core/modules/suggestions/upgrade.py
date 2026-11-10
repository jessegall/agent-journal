from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_a_version_4_suggestion_keeps_its_answer_so_it_is_not_offered_again(new_story):
    story = upgraded_story(new_story)
    story.expect_text("suggestion list", "Run Code Commandments as a plugin", "declined")
    expect_upgrade_text(story, "journal.core.suggestions: moved 1")
