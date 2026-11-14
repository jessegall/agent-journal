from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.registry_compare import expect_registry_equal, saved_registry


def test_a_sync_of_unchanged_modules_leaves_the_registry_equal_to_the_saved_one(new_story):
    story = new_story(fixture=MainEnvironment)
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)
