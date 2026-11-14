import pytest

from core.modules.tunnel.support.tunnels import SERVICE_SETTING
from tests.integration.support.integration_server import integration_server
from tests.stories.engine.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS


@pytest.fixture
def tunnel_journal(journal):
    synced = journal.synced_with(f"{PATH}:SampleTunnelModule")
    assert synced.code == 0, synced.text
    assert journal.run(f"setting set {SERVICE_SETTING} sample --project").code == 0
    return journal


def test_the_server_opens_the_chosen_tunnel_for_the_viewers_port(tunnel_journal):
    with integration_server(tunnel_journal) as server:
        server.context.tunnel.follow(server.viewer_port())
        assert server.context.tunnel.address() == SAMPLE_ADDRESS


def test_a_restarted_server_opens_the_tunnel_again(tunnel_journal):
    with integration_server(tunnel_journal) as server:
        server.context.tunnel.follow(server.viewer_port())
        server.context.tunnel.close()
    with integration_server(tunnel_journal) as server:
        server.context.tunnel.follow(server.viewer_port())
        assert server.context.tunnel.address() == SAMPLE_ADDRESS


def test_a_tunnel_that_dropped_is_opened_again_by_the_next_check(tunnel_journal):
    with integration_server(tunnel_journal) as server:
        server.context.tunnel.follow(server.viewer_port())
        server.context.tunnel.current.close()
        server.context.tunnel.follow(server.viewer_port())
        assert server.context.tunnel.address() == SAMPLE_ADDRESS
