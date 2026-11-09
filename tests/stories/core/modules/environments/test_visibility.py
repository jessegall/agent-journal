import json

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story


def test_a_persons_lists_and_menu_hide_test_environments(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    story.expect_absent("environment list", "story-engine", actor=story.user)
    story.expect_text("environment list --all", "story-engine", actor=story.user)
    story.expect_absent("environment menu", "story-engine", actor=story.user)
    cards = story.run("environment cards --json", actor=story.user)
    story.expect_rows(cards.code == 0, all(row["name"] != "story-engine" for row in json.loads(cards.output_text)["rows"]))


def test_an_agent_can_list_its_test_environment(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    story.expect_text("environment list", "story-engine", actor=story.agent)


def test_the_viewer_settings_environment_list_hides_test_environments(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        cards = server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["environment", "cards"]})
        story.expect_rows(all(row["name"] != "story-engine" for row in cards["rows"]))
