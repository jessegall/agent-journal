import json

from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_persons_lists_and_menu_hide_test_environments(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    story.expect_absent("environment list", "story-engine", actor=story.user)
    story.expect_text("environment list --all", "story-engine", actor=story.user)
    story.expect_absent("environment menu", "story-engine", actor=story.user)
    cards = story.run("environment cards --json", actor=story.user)
    story.expect_rows(cards.code == 0, all(row["name"] != "story-engine" for row in json.loads(cards.output_text)["rows"]))


def test_an_agent_can_list_its_test_environment(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("environment make story-engine /work/story-engine --test", actor=story.user)
    story.expect_text("environment list", "story-engine", actor=story.agent)
