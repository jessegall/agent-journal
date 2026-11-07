import json

from tests.stories.core.support.fixtures import UserJoined


def shown(story, agent_id: int) -> dict:
    return json.loads(story.run(f"agent show {agent_id} --json", actor=story.user).output_text)


def test_a_running_agent_shows_working_or_waiting(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-run claude worker --environment main")
    assert shown(story, agent_id)["activity"] == "working"


def test_a_paused_agent_shows_paused(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-pause claude worker --environment main")
    story.expect_success(f"agent pause {agent_id}", actor=story.user)
    assert shown(story, agent_id)["activity"] == "paused"


def test_an_ended_agent_shows_ended(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-end claude worker --environment main")
    story.expect_success(f"agent end {agent_id}", actor=story.user)
    assert shown(story, agent_id)["activity"] == "ended"


def test_the_display_name_is_the_one_the_viewer_titles_it_with(new_story):
    story = new_story(fixture=UserJoined)
    agent_id = story.new_row_id("agent start s-name claude worker --environment main")
    helper_id = story.new_row_id("agent start s-helper claude helper --environment main")
    assert (shown(story, agent_id)["display_name"], shown(story, helper_id)["display_name"]) == (f"Worker {agent_id}", f"Helper {helper_id}")
    assert shown(story, story.agent.id)["display_name"] in ("Main agent", f"{shown(story, story.agent.id)['role'].capitalize()} {story.agent.id}")
