from core.base.tunnel.tunnel_state import TunnelState
from core.modules.tunnel.support.tunnels import Tunnels
from tests.stories.core.base.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS
from tests.stories.core.support.fixtures import UserJoined

SERVICE = "journal.core.tunnel.service"
VIEWER_PORT = 8000


def tunnel_story(new_story):
    return new_story(f"{PATH}:SampleTunnelModule", fixture=UserJoined)


def test_with_no_tunnel_chosen_there_is_no_outside_address(new_story):
    story = tunnel_story(new_story)
    tunnel = story.container.get(Tunnels).chosen()
    tunnel.open(VIEWER_PORT)
    story.expect_rows(tunnel.address() is None, tunnel.state() is TunnelState.DISCONNECTED)


def test_the_chosen_tunnel_opens_the_viewer_port_and_closes_it(new_story):
    story = tunnel_story(new_story)
    story.expect_success(f"setting set {SERVICE} sample --project", actor=story.user)
    tunnel = story.container.get(Tunnels).chosen()
    tunnel.open(VIEWER_PORT)
    story.expect_rows(tunnel.address() == SAMPLE_ADDRESS, tunnel.state() is TunnelState.CONNECTED)
    tunnel.close()
    story.expect_rows(tunnel.state() is TunnelState.DISCONNECTED)


def test_a_service_no_module_declares_is_refused(new_story):
    story = tunnel_story(new_story)
    story.expect_refusal(f"setting set {SERVICE} nowhere --project", "no installed module declares the tunnel nowhere", actor=story.user)


def test_the_installed_tunnels_are_listed_with_no_tunnel_among_them(new_story):
    story = tunnel_story(new_story)
    story.expect_rows([tunnel.name for tunnel in story.container.get(Tunnels).all()] == ["none", "sample", "tunler"])
