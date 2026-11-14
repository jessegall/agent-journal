from tests.stories.core.support.agent_labels import agent_number
import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def shown(story, agent_id: int) -> dict:
    return json.loads(story.run(f"agent show {agent_number(story, agent_id)} --json", actor=story.user).output_text)


def test_a_running_agent_shows_working_or_waiting(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-run claude worker --environment main")
    expect_value(shown(story, agent_id)["activity"], "working")


def test_a_paused_agent_shows_paused(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-pause claude worker --environment main")
    story.expect_success(f"agent pause {agent_number(story, agent_id)}", actor=story.user)
    expect_value(shown(story, agent_id)["activity"], "paused")


def test_an_ended_agent_shows_ended(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-end claude worker --environment main")
    story.expect_success(f"agent end {agent_id}", actor=story.user)
    expect_value(shown(story, agent_id)["activity"], "ended")
