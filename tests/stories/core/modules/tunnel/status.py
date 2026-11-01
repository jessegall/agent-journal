import json

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def test_the_tunnel_window_reads_the_state_of_the_chosen_tunnel(new_story):
    story = new_story(fixture=UserJoined)
    WindowStory(story).expect_window_allowed("tunnel.tunnel", "tunnel status")
    answer = json.loads(story.run("tunnel status --json", actor=story.user).output_text)
    assert answer["state"] == "disconnected" and answer["address"] is None
