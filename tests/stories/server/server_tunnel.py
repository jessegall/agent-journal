from tests.stories.core.base.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

SERVICE = "journal.core.tunnel.service"


def tunnel_journal(new_story):
    journal = new_story(f"{PATH}:SampleTunnelModule", fixture=UserJoined)
    journal.expect_success(f"setting set {SERVICE} sample --project", actor=journal.user)
    return journal


def test_the_server_opens_the_chosen_tunnel_for_the_viewers_port(new_story):
    with server_story(tunnel_journal(new_story)) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)


def test_a_changed_choice_closes_the_old_tunnel_and_opens_the_new_one(new_story):
    with server_story(tunnel_journal(new_story)) as story:
        story.context.tunnel.follow(story.viewer_port())
        opened = story.context.tunnel.current
        story.story.expect_success(f"setting set {SERVICE} none --project", actor=story.story.user)
        story.context.tunnel.follow(story.viewer_port())
        story.story.expect_rows(opened.address() is None, story.context.tunnel.address() is None, story.context.tunnel.current.name == "none")


def test_a_restarted_server_opens_the_tunnel_again(new_story):
    journal = tunnel_journal(new_story)
    with server_story(journal) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.context.tunnel.close()
    with server_story(journal) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)


def test_a_tunnel_that_dropped_is_opened_again_by_the_next_check(new_story):
    with server_story(tunnel_journal(new_story)) as story:
        story.context.tunnel.follow(story.viewer_port())
        story.context.tunnel.current.close()
        story.context.tunnel.follow(story.viewer_port())
        story.story.expect_rows(story.context.tunnel.address() == SAMPLE_ADDRESS)
