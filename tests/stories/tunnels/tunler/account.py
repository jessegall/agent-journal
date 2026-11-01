import json

from core.base.tunnel.tunnel_state import TunnelState
from core.modules.settings.bindings.support.setting_values import SettingValues
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.tunnels.tunler.support.fake_tunler_client import ACCOUNT, TUNLER_HOST, FakeTunlerClient
from tests.stories.tunnels.tunler.support.set_clock import SetClock
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_tunnel import TunlerTunnel

MODULE = "tunnels.tunler.tunler_module:TunlerModule"
SUBDOMAIN_SETTING = "journal.tunnels.tunler.subdomain"
SERVICE_SETTING = "journal.core.tunnel.service"
OWN_DOMAIN = f"cart-team.{TUNLER_HOST}"
SPARE_DOMAIN = f"old-shop.{TUNLER_HOST}"
VIEWER_PORT = 8000


def account_story(new_story, client: FakeTunlerClient | None = None):
    story = new_story(MODULE, fixture=UserJoined)
    fake = client or FakeTunlerClient()
    story.container.bind(TunlerClient, fake)
    return story, fake


def answer(story, line: str) -> dict:
    return json.loads(story.run(f"{line} --json", actor=story.user).output_text)


def test_the_status_says_who_is_logged_in_where_and_whether_this_journal_uses_tunler(new_story):
    story, _ = account_story(new_story)
    status = answer(story, "tunler status")
    assert status["installed"] and status["authenticated"] and status["account"] == ACCOUNT and status["host"] == TUNLER_HOST
    assert not status["in_use"] and status["subdomain"] == ""
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    story.expect_success(f"setting set {SERVICE_SETTING} tunler --project", actor=story.user)
    status = answer(story, "tunler status")
    assert status["in_use"] and status["subdomain"] == "cart-team"


def test_a_machine_without_tunler_says_so_and_a_refused_login_says_it_was_refused(new_story):
    story, _ = account_story(new_story, FakeTunlerClient(installed=False))
    assert not answer(story, "tunler status")["installed"]
    refused, _ = account_story(new_story, FakeTunlerClient(authenticated=False, rejected=True))
    status = answer(refused, "tunler status")
    assert status["rejected"] and not status["authenticated"]


def test_logging_in_connects_this_machine(new_story):
    client = FakeTunlerClient(authenticated=False)
    story, _ = account_story(new_story, client)
    assert answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one")["connected"]
    assert client.logins == [(TUNLER_HOST, ACCOUNT, "secret-one", None)]
    assert answer(story, "tunler status")["authenticated"]


def test_a_new_account_asks_for_the_master_password_and_then_logs_in(new_story):
    client = FakeTunlerClient(authenticated=False, master_needed=True)
    story, _ = account_story(new_story, client)
    first = answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one")
    assert first["needs_master"] and not first["connected"]
    second = answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one --master top-secret")
    assert second["connected"] and client.logins[-1][3] == "top-secret"


def test_a_wrong_password_gives_tunlers_own_words_and_leaves_the_machine_logged_out(new_story):
    client = FakeTunlerClient(authenticated=False, login_error="wrong password")
    story, _ = account_story(new_story, client)
    assert answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} nope")["error"] == "wrong password"
    assert not answer(story, "tunler status")["authenticated"]


def test_logging_out_leaves_the_machine_logged_out(new_story):
    client = FakeTunlerClient()
    story, _ = account_story(new_story, client)
    story.expect_success("tunler logout", actor=story.user)
    assert client.logged_out == 1 and not answer(story, "tunler status")["authenticated"]


def test_the_domains_name_the_one_this_journal_uses(new_story):
    story, _ = account_story(new_story, FakeTunlerClient(domains=[OWN_DOMAIN, SPARE_DOMAIN]))
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    rows = answer(story, "tunler domains")["domains"]
    assert rows == [{"name": OWN_DOMAIN, "own": True}, {"name": SPARE_DOMAIN, "own": False}]


def test_releasing_a_domain_takes_it_off_the_account_and_a_failure_is_refused(new_story):
    client = FakeTunlerClient(domains=[OWN_DOMAIN, SPARE_DOMAIN])
    story, _ = account_story(new_story, client)
    story.expect_success(f"tunler release {SPARE_DOMAIN}", actor=story.user)
    assert client.domain_names == [OWN_DOMAIN]
    client.release_error = "the server said no"
    story.expect_refusal(f"tunler release {OWN_DOMAIN}", "the server said no", actor=story.user)


def test_the_version_says_when_a_newer_one_waits_and_an_update_takes_it(new_story):
    client = FakeTunlerClient(latest="v0.3.0")
    story, _ = account_story(new_story, client)
    version = answer(story, "tunler version")
    assert version == {"current": "v0.2.0", "latest": "v0.3.0", "update_available": True}
    story.expect_text("tunler update", "tunler is now v0.3.0", actor=story.user)
    assert not answer(story, "tunler version")["update_available"]


def test_installing_takes_the_server_address_without_its_scheme_or_path(new_story):
    client = FakeTunlerClient(installed=False)
    story, _ = account_story(new_story, client)
    story.expect_text(f"tunler install https://{TUNLER_HOST}/page", "tunler v0.2.0 is installed", actor=story.user)
    assert client.installed_from == [TUNLER_HOST] and answer(story, "tunler status")["installed"]


def test_only_a_person_logs_in_or_changes_tunler(new_story):
    story, _ = account_story(new_story)
    for line in (f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one", "tunler logout", "tunler update", f"tunler install {TUNLER_HOST}", f"tunler release {SPARE_DOMAIN}"):
        story.expect_refusal(line, "only a person", actor=story.agent)


def test_the_tunler_window_declares_what_it_reads_and_runs(new_story):
    story, _ = account_story(new_story)
    window = WindowStory(story)
    for line in ("tunler status", "tunler domains", "tunler version", f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one", "tunler logout", "tunler update",
                 f"tunler install {TUNLER_HOST}", f"tunler release {SPARE_DOMAIN}", f"setting set {SUBDOMAIN_SETTING} cart-team --project", f"setting set {SERVICE_SETTING} tunler --project"):
        window.expect_window_allowed("tunler.account", line)


def test_a_tunnel_made_for_one_read_sees_the_tunler_the_server_opened(new_story):
    story, client = account_story(new_story)
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    TunlerTunnel(client, story.container.get(SettingValues), SetClock()).open(VIEWER_PORT)
    new = TunlerTunnel(client, story.container.get(SettingValues), SetClock())
    story.expect_rows(new.state() is TunnelState.CONNECTED, new.address() == f"https://cart-team.{TUNLER_HOST}", new.reason() == "")


def test_a_tunnel_made_for_one_read_says_why_none_is_open(new_story):
    story, client = account_story(new_story, FakeTunlerClient(authenticated=False))
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    new = TunlerTunnel(client, story.container.get(SettingValues), SetClock())
    story.expect_rows(new.state() is TunnelState.DISCONNECTED, new.reason() == "this machine is not logged in to tunler: run tunler login")
