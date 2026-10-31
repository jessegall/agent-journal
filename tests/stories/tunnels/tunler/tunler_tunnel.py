from core.base.tunnel.tunnel_state import TunnelState
from core.modules.settings.bindings.support.setting_values import SettingValues
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.tunnels.tunler.support.fake_tunler_client import TUNLER_HOST, FakeTunlerClient
from tests.stories.tunnels.tunler.support.set_clock import SetClock
from tunnels.tunler.tunler_tunnel import CONNECT_LIMIT_SECONDS, TunlerTunnel

SUBDOMAIN = "cart-team"
VIEWER_PORT = 8000


def tunnel(new_story, client: FakeTunlerClient, clock: SetClock | None = None):
    story = new_story("tunnels.tunler.tunler_module:TunlerModule", fixture=UserJoined)
    story.expect_success(f"setting set journal.tunnels.tunler.subdomain {SUBDOMAIN} --project", actor=story.user)
    return story, TunlerTunnel(client, story.container.get(SettingValues), clock or SetClock())


def test_open_starts_tunler_for_the_viewers_port_under_the_journals_name(new_story):
    client = FakeTunlerClient()
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    story.expect_rows(client.started == [(VIEWER_PORT, SUBDOMAIN)], tunler.address() == f"https://{SUBDOMAIN}.{TUNLER_HOST}", tunler.state() is TunnelState.CONNECTED)


def test_a_machine_without_tunler_gets_no_address_and_the_reason(new_story):
    client = FakeTunlerClient(installed=False)
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    story.expect_rows(tunler.address() is None, tunler.state() is TunnelState.DISCONNECTED, tunler.reason() == "tunler is not installed on this machine")


def test_a_machine_not_logged_in_to_tunler_gets_no_address_and_the_way_to_log_in(new_story):
    client = FakeTunlerClient(authenticated=False)
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    story.expect_rows(client.started == [], tunler.state() is TunnelState.DISCONNECTED, tunler.reason() == "this machine is not logged in to tunler: run tunler login")


def test_a_tunler_that_stopped_shows_the_tunnel_disconnected(new_story):
    client = FakeTunlerClient()
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    client.connection, client.exit_line = TunnelState.DISCONNECTED, "dial tcp: lookup tunler.example: no such host"
    story.expect_rows(tunler.state() is TunnelState.DISCONNECTED, tunler.address() is None, tunler.reason() == "tunler stopped: dial tcp: lookup tunler.example: no such host")


def test_a_tunler_that_lost_its_server_and_tries_again_is_reconnecting_and_keeps_its_address(new_story):
    client = FakeTunlerClient()
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    client.connection = TunnelState.RECONNECTING
    story.expect_rows(tunler.state() is TunnelState.RECONNECTING, tunler.address() == f"https://{SUBDOMAIN}.{TUNLER_HOST}")
    client.connection = TunnelState.CONNECTED
    story.expect_rows(tunler.state() is TunnelState.CONNECTED)


def test_a_tunler_that_does_not_connect_within_the_limit_is_stopped_with_the_reason(new_story):
    client, clock = FakeTunlerClient(connects=False), SetClock()
    story, tunler = tunnel(new_story, client, clock)
    tunler.open(VIEWER_PORT)
    story.expect_rows(tunler.state() is TunnelState.RECONNECTING)
    clock.move(CONNECT_LIMIT_SECONDS + 1)
    story.expect_rows(tunler.state() is TunnelState.DISCONNECTED, client.stopped == 1, tunler.reason() == f"tunler did not connect within {CONNECT_LIMIT_SECONDS} seconds")


def test_close_stops_tunler(new_story):
    client = FakeTunlerClient()
    story, tunler = tunnel(new_story, client)
    tunler.open(VIEWER_PORT)
    tunler.close()
    story.expect_rows(client.stopped == 1, tunler.state() is TunnelState.DISCONNECTED)


def test_a_journal_with_no_subdomain_set_gets_the_setting_to_set(new_story):
    story = new_story("tunnels.tunler.tunler_module:TunlerModule", fixture=UserJoined)
    tunler = TunlerTunnel(FakeTunlerClient(), story.container.get(SettingValues), SetClock())
    tunler.open(VIEWER_PORT)
    story.expect_rows(tunler.state() is TunnelState.DISCONNECTED, tunler.reason() == "name the subdomain with journal setting set journal.tunnels.tunler.subdomain <name> --project")
