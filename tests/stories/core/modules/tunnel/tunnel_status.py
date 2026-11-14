from tests.stories.core.support.fixtures import UserJoined


def test_with_no_tunnel_set_the_status_says_how_to_set_one(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("tunnel status", "disconnected", "setting", actor=story.agent)
