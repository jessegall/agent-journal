import json

from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest

from engine.enums.tunnel_state import TunnelState
from engine.setting.setting_values import SettingValues
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.tunnels.tunler.support.fake_tunler_client import ACCOUNT, TUNLER_HOST, FakeTunlerClient
from tests.stories.tunnels.tunler.support.set_clock import SetClock
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_tunnel import TunlerTunnel
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client
from core.modules.tunnel.support.tunnels import SERVICE_SETTING
from tunnels.tunler.support.tunler_tunnel import SUBDOMAIN_SETTING

MODULE = "tunnels.tunler.tunler_module:TunlerModule"
SUBDOMAIN_SETTING = f"{SUBDOMAIN_SETTING}"
SERVICE_SETTING = f"{SERVICE_SETTING}"
TEAM_DOMAIN = f"cart-team.{TUNLER_HOST}"
SPARE_DOMAIN = f"old-shop.{TUNLER_HOST}"
VIEWER_PORT = 8000


def account_story(new_story, client: FakeTunlerClient | None = None):
    story = new_story(MODULE, fixture=UserJoined)
    fake = client or FakeTunlerClient()
    story.bind(TunlerClient, fake)
    return story, fake


def answer(story, line: str) -> dict:
    return json.loads(story.run(f"{line} --json", actor=story.user).output_text)


def test_the_status_says_who_is_logged_in_where_and_whether_this_journal_uses_tunler(new_story):
    story, _ = account_story(new_story)
    status = answer(story, "tunler status")
    expect_installed_status(status)
    expect_authenticated_status(status)
    expect_account_status(status, ACCOUNT)
    expect_host_status(status, TUNLER_HOST)
    expect_absent_used_status(status)
    expect_subdomain_status(status, "")
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    story.expect_success(f"setting set {SERVICE_SETTING} tunler --project", actor=story.user)
    status = answer(story, "tunler status")
    expect_used_status(status)
    expect_subdomain_status(status, "cart-team")


def test_a_new_account_asks_for_the_master_password_and_then_logs_in(new_story):
    client = FakeTunlerClient(authenticated=False, master_needed=True)
    story, _ = account_story(new_story, client)
    first = answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one")
    expect_needs_master(first)
    expect_absent_connected(first)
    second = answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one --master top-secret")
    expect_connected_second(second)
    expect_logins_client(client, 1, "top-secret")


def test_a_wrong_password_gives_tunlers_own_words_and_leaves_the_machine_logged_out(new_story):
    client = FakeTunlerClient(authenticated=False, login_error="wrong password")
    story, _ = account_story(new_story, client)
    expect_row(answer(story, f"tunler login {TUNLER_HOST} {ACCOUNT} nope"), error="wrong password")
    expect_absent_authenticated_answer(story, "tunler status")


def test_logging_out_leaves_the_machine_logged_out(new_story):
    client = FakeTunlerClient()
    story, _ = account_story(new_story, client)
    story.expect_success("tunler logout", actor=story.user)
    expect_logged_client(client, 1)
    expect_absent_authenticated_answer(story, "tunler status")


def test_the_domains_name_the_one_this_journal_uses(new_story):
    story, _ = account_story(new_story, FakeTunlerClient(domains=[TEAM_DOMAIN, SPARE_DOMAIN]))
    story.expect_success(f"setting set {SUBDOMAIN_SETTING} cart-team --project", actor=story.user)
    rows = answer(story, "tunler domains")["domains"]
    expect_value(rows, [{"name": TEAM_DOMAIN, "own": True}, {"name": SPARE_DOMAIN, "own": False}])


def test_releasing_a_domain_takes_it_off_the_account_and_a_failure_is_refused(new_story):
    client = FakeTunlerClient(domains=[TEAM_DOMAIN, SPARE_DOMAIN])
    story, _ = account_story(new_story, client)
    story.expect_success(f"tunler release {SPARE_DOMAIN}", actor=story.user)
    expect_row(client, domain_names=[TEAM_DOMAIN])
    client.release_error = "the server said no"
    story.expect_refusal(f"tunler release {TEAM_DOMAIN}", "the server said no", actor=story.user)


def test_the_version_says_when_a_newer_one_waits_and_an_update_takes_it(new_story):
    client = FakeTunlerClient(latest="v0.3.0")
    story, _ = account_story(new_story, client)
    version = answer(story, "tunler version")
    expect_value(version, {"current": "v0.2.0", "latest": "v0.3.0", "update_available": True})
    story.expect_text("tunler update", "tunler is now v0.3.0", actor=story.user)
    expect_absent_update_available_answer(story, "tunler version")


def test_installing_takes_the_server_address_without_its_scheme_or_path(new_story):
    client = FakeTunlerClient(installed=False)
    story, _ = account_story(new_story, client)
    story.expect_text(f"tunler install https://{TUNLER_HOST}/page", "tunler v0.2.0 is installed", actor=story.user)
    expect_installed_client(client, [TUNLER_HOST])
    expect_installed_answer(story, "tunler status")


def test_only_a_person_logs_in_or_changes_tunler(new_story):
    story, _ = account_story(new_story)
    story.expect_refusal(f"tunler login {TUNLER_HOST} {ACCOUNT} secret-one", "sign-in credentials are entered by a user", actor=story.agent)
    for line in ("tunler logout", "tunler update", f"tunler install {TUNLER_HOST}", f"tunler release {SPARE_DOMAIN}"):
        story.expect_refusal(f"{line} --reason needed", "A user was asked in the dock", actor=story.agent)


def test_a_person_accepts_a_tunler_logout_request_in_the_viewer(new_story, monkeypatch):
    story, client = account_story(new_story)
    story.expect_refusal("tunler logout --reason needed", "A user was asked in the dock", actor=story.agent)
    approval = story.container.get(Queries).query(ApprovalRequest).first()
    monkeypatch.setattr(TunlerClient, "logout", lambda self: client.logout())
    with viewer_client(story) as viewer:
        viewer.value("messages.chat", ["approval", "accept", str(approval.id)])
    expect_logged_client(client, 1)
    story.expect_rows(not client.authenticated)


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
    story.expect_rows(new.state() is TunnelState.DISCONNECTED, new.reason() == "this machine is not logged in to Tunler: sign in on the Tunler page")


def expect_installed_client(client, expected) -> None:
    actual = client.installed_from
    assert actual == expected, actual


def expect_installed_answer(story, text) -> None:
    actual = answer(story, text)['installed']
    assert actual, actual


def expect_absent_update_available_answer(story, text) -> None:
    actual = answer(story, text)['update_available']
    assert not actual, actual


def expect_logged_client(client, expected) -> None:
    actual = client.logged_out
    assert actual == expected, actual


def expect_absent_authenticated_answer(story, text) -> None:
    actual = answer(story, text)['authenticated']
    assert not actual, actual


def expect_connected_second(second) -> None:
    actual = second['connected']
    assert actual, actual


def expect_logins_client(client, number, expected) -> None:
    actual = client.logins[-number][3]
    assert actual == expected, actual


def expect_needs_master(first) -> None:
    actual = first['needs_master']
    assert actual, actual


def expect_absent_connected(first) -> None:
    actual = first['connected']
    assert not actual, actual


def expect_used_status(status) -> None:
    actual = status['is_used']
    assert actual, actual


def expect_subdomain_status(status, expected) -> None:
    actual = status['subdomain']
    assert actual == expected, actual


def expect_absent_used_status(status) -> None:
    actual = status['is_used']
    assert not actual, actual


def expect_installed_status(status) -> None:
    actual = status['installed']
    assert actual, actual


def expect_authenticated_status(status) -> None:
    actual = status['authenticated']
    assert actual, actual


def expect_account_status(status, expected) -> None:
    actual = status['account']
    assert actual == expected, actual


def expect_host_status(status, expected) -> None:
    actual = status['host']
    assert actual == expected, actual
