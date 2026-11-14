from engine.hosting.hosting import Hosting
from tests.stories.support.story_checks import expect_value


def test_a_story_with_no_hosted_file_is_not_hosted(journal):
    expect_value(journal.container.get(Hosting).is_hosted, False)
