from engine.tunnel.tunnel_state import TunnelState
from core.modules.settings.bindings.support.setting_values import SettingValues
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.tunnels.tunler.support.fake_tunler_client import TUNLER_HOST, FakeTunlerClient
from tests.stories.tunnels.tunler.support.set_clock import SetClock
from tunnels.tunler.support.tunler_tunnel import CONNECT_LIMIT_SECONDS, TunlerTunnel

SUBDOMAIN = "cart-team"
VIEWER_PORT = 8000


def tunnel(new_story, client: FakeTunlerClient, clock: SetClock | None = None):
    story = new_story("tunnels.tunler.tunler_module:TunlerModule", fixture=UserJoined)
    story.expect_success(f"setting set journal.tunnels.tunler.subdomain {SUBDOMAIN} --project", actor=story.user)
    return story, TunlerTunnel(client, story.container.get(SettingValues), clock or SetClock())


def test_a_journal_with_no_subdomain_set_gets_the_setting_to_set(new_story):
    story = new_story("tunnels.tunler.tunler_module:TunlerModule", fixture=UserJoined)
    tunler = TunlerTunnel(FakeTunlerClient(), story.container.get(SettingValues), SetClock())
    tunler.open(VIEWER_PORT)
    story.expect_rows(tunler.state() is TunnelState.DISCONNECTED, tunler.reason() == "name the subdomain with journal setting set journal.tunnels.tunler.subdomain <name> --project")
