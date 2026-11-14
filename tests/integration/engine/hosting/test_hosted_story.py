from tests.stories.core.support.hosted_fixtures import start_hosted
from engine.hosting.hosting import Hosting
from tests.stories.support.story_checks import expect_value


def test_a_story_with_no_hosted_file_is_not_hosted(journal):
    expect_value(journal.container.get(Hosting).is_hosted, False)


def test_a_story_started_hosted_reports_hosting_on_with_the_file_it_wrote(played):
    story = played()
    kernel = start_hosted(story, agent_group={4242: 7})
    hosting = story.container.get(Hosting)
    expect_value(hosting.is_hosted, True)
    expect_value(hosting.mode.public_origin, "https://journal.example.com")
    expect_value(kernel.agent_group.agent_ids[4242], 7)
