from core.base.hosting.hosting import Hosting
from tests.stories.core.support.hosted_fixtures import start_hosted
from tests.stories.support.story_checks import expect_value


def test_a_story_started_hosted_reports_hosting_on_with_the_file_it_wrote(new_story):
    story = new_story()
    kernel = start_hosted(story, agent_group={4242: 7})
    hosting = story.container.get(Hosting)
    expect_value(hosting.is_hosted, True)
    expect_value(hosting.mode.public_origin, "https://journal.example.com")
    expect_value(kernel.agent_group.agent_ids[4242], 7)


def test_a_story_with_no_hosted_file_is_not_hosted(new_story):
    story = new_story()
    expect_value(story.container.get(Hosting).is_hosted, False)
