import json

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row


def test_the_tunnel_window_reads_the_state_of_the_chosen_tunnel(new_story):
    story = new_story(fixture=UserJoined)
    WindowStory(story).expect_window_allowed("tunnel.tunnel", "tunnel status")
    answer = json.loads(story.run("tunnel status --json", actor=story.user).output_text)
    expect_row(answer, state="disconnected")
    expect_row(answer, address=None)
