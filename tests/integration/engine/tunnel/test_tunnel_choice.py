from engine.enums.tunnel_state import TunnelState
from core.modules.tunnel.support.tunnels import Tunnels
from tests.stories.engine.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS
from tests.stories.core.support.fixtures import UserJoined
from core.modules.tunnel.support.tunnels import SERVICE_SETTING

SERVICE = f"{SERVICE_SETTING}"
VIEWER_PORT = 8000


def tunnel_story(played):
    return played(UserJoined, f"{PATH}:SampleTunnelModule")


def test_with_no_tunnel_chosen_there_is_no_outside_address(played):
    story = tunnel_story(played)
    tunnel = story.container.get(Tunnels).chosen()
    tunnel.open(VIEWER_PORT)
    story.expect_rows(tunnel.address() is None, tunnel.state() is TunnelState.DISCONNECTED)


def test_the_chosen_tunnel_opens_the_viewer_port_and_closes_it(played):
    story = tunnel_story(played)
    story.expect_success(f"setting set {SERVICE} sample --project", actor=story.user)
    tunnel = story.container.get(Tunnels).chosen()
    tunnel.open(VIEWER_PORT)
    story.expect_rows(tunnel.address() == SAMPLE_ADDRESS, tunnel.state() is TunnelState.CONNECTED)
    tunnel.close()
    story.expect_rows(tunnel.state() is TunnelState.DISCONNECTED)




def test_the_installed_tunnels_are_listed_with_no_tunnel_among_them(played):
    story = tunnel_story(played)
    story.expect_rows([tunnel.name for tunnel in story.container.get(Tunnels).all()] == ["none", "sample", "tunler"])
