import pytest

from tests.stories.engine.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from core.modules.tunnel.support.tunnels import SERVICE_SETTING

SERVICE = f"{SERVICE_SETTING}"


def tunnel_journal(new_story):
    journal = new_story(f"{PATH}:SampleTunnelModule", fixture=UserJoined)
    journal.expect_success(f"setting set {SERVICE} sample --project", actor=journal.user)
    return journal


def test_the_server_opens_the_chosen_tunnel_for_the_viewers_port(server_tunnel_server):
    story = server_tunnel_server
    story.context.tunnel.follow(story.viewer_port())
    story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)


def test_a_restarted_server_opens_the_tunnel_again(new_story):
    journal = tunnel_journal(new_story)
    with server_story(journal) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.context.tunnel.close()
    with server_story(journal) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)


def test_a_tunnel_that_dropped_is_opened_again_by_the_next_check(server_tunnel_server):
    story = server_tunnel_server
    story.context.tunnel.follow(story.viewer_port())
    story.context.tunnel.current.close()
    story.context.tunnel.follow(story.viewer_port())
    story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)


@pytest.fixture
def server_tunnel_server(new_story):
    with server_story(tunnel_journal(new_story)) as story:
        yield story
