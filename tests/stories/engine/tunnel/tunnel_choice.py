from engine.enums.tunnel_state import TunnelState
from core.modules.tunnel.support.tunnels import Tunnels
from tests.stories.engine.tunnel.support.tunnel_samples import PATH, SAMPLE_ADDRESS
from tests.stories.core.support.fixtures import UserJoined
from core.modules.tunnel.support.tunnels import SERVICE_SETTING

SERVICE = f"{SERVICE_SETTING}"
VIEWER_PORT = 8000


def tunnel_story(new_story):
    return new_story(f"{PATH}:SampleTunnelModule", fixture=UserJoined)






def test_a_service_no_module_declares_is_refused(new_story):
    story = tunnel_story(new_story)
    story.expect_refusal(f"setting set {SERVICE} nowhere --project", "no installed module declares the tunnel nowhere", actor=story.user)


