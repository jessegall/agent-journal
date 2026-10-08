import errno
import json
import os
import socket
import subprocess
import sys
import time
import threading
from concurrent.futures import ThreadPoolExecutor
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import NamedTuple
from urllib.parse import urlencode

import pytest

from agents.terminal import TooManyAgents, refuse_past_cap
from controllers.features import Features
from engine import disk
from engine.sessions import Sessions
from engine.viewer import SERVING
from features.hosted_journal.details import HostedJournalDetails
from features.hosted_journal.gateway import CHECKS_AT_ONCE, COOKIE, DEVICE_COOKIE, MOST_STREAMS, Visit
from features.hosted_journal.host import clear_tries
from features.hosted_journal.owner import LOCKED_FOR, LOGINS, MOST_EVERYWHERE, MOST_TRIES, Logins, Owner, WrongTries, hashed
from features.hosted_journal.feature import APART
from features.hosted_journal.phones import KEPT_ELSEWHERE, PHONES
from features.hosted_journal.settings import FromRecord, GatewaySettings, keep_gateway_settings
from features.hosted_journal.vault import AUDIT, VAULT, DiskFull, RefusalLog, Vault
from features.trigger import DAY
from features.phone.controller import Phones
from features.sharing.controller import Shares
from features.sharing.routes import EVERY_OTHER, ROUTES
from features.sharing.server import ShareHandler
from features.sharing.services import share_services
from features.sharing.tunnel import SERVER
from resources.base import SYSTEM, USER
from serve import Handler, JournalServer
from tests.conftest import fresh

ADDRESS = "journal.example.com"
PASSWORD = "correct horse battery"
SRC = Path(__file__).resolve().parents[2]
WEB = SRC / "web"
APART_WAIT = 30
SCENARIOS_WAIT = 240


class Answer(NamedTuple):
    status: int
    headers: dict
    text: str


class Hosted(NamedTuple):
    record: object
    port: int
    vault: Vault

    def call(self, method: str, path: str, form: dict | None = None, body: str | None = None, **headers) -> Answer:
        given = {"Host": f"127.0.0.1:{self.port}", **{name.replace("_", "-"): value for name, value in headers.items()}}
        if form is not None:
            body = urlencode(form)
            given = {"Content-Type": "application/x-www-form-urlencoded", "Origin": f"http://127.0.0.1:{self.port}", **given}
        connection = HTTPConnection("127.0.0.1", self.port, timeout=10)
        connection.request(method, path, None if body is None else body.encode(), given)
        reply = connection.getresponse()
        headers: dict[str, str] = {}
        for name, value in reply.getheaders():
            headers[name.lower()] = f"{headers[name.lower()]}\n{value}" if name.lower() in headers else value
        answer = Answer(reply.status, headers, reply.read().decode(errors="replace"))
        connection.close()
        return answer

    def logged_in(self) -> str:
        if not Owner(self.vault).has_password():
            Owner(self.vault).set_password(PASSWORD)
        return Logins(self.vault).open(7, "test")


def serve(record) -> int:
    server = ThreadingHTTPServer(("127.0.0.1", 0), type("Bound", (ShareHandler,), {"shares": Shares(record, actor=SYSTEM)}))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server.server_port


@pytest.fixture
def hosted():
    import features
    features.load()
    record = fresh("main")
    Features(record, actor=USER).switch(HostedJournalDetails.name, True)
    Features(record, actor=USER).configure(HostedJournalDetails.name, "address", ADDRESS)
    desk = JournalServer(("127.0.0.1", 0), type("Desk", (Handler,), {"root": record.root}))
    threading.Thread(target=desk.serve_forever, daemon=True).start()
    SERVING[str(record.root.resolve())] = f"http://127.0.0.1:{desk.server_port}/"
    yield Hosted(record, serve(record), Vault(record.root))
    desk.shutdown()


def test_with_hosting_off_the_share_server_answers_no_login_and_no_viewer():
    import features
    features.load()
    record = fresh()
    port = serve(record)
    off = Hosted(record, port, Vault(record.root))
    assert off.call("GET", "/").status == 404
    assert off.call("GET", "/login").status == 404
    assert off.call("POST", "/login", {"password": PASSWORD}).status == 405
    assert EVERY_OTHER not in ROUTES.keyed(record)
    assert not Vault(record.root).folder.exists()


def test_the_owner_sets_the_password_with_a_one_time_code_then_works_in_the_viewer_through_the_journals_own_loopback_check(hosted):
    assert "Set up" in hosted.call("GET", "/login").text
    code = Owner(hosted.vault).make_setup_code()
    assert hosted.call("POST", "/setup", {"code": "nope", "password": PASSWORD, "again": PASSWORD}).status == 401
    assert hosted.call("POST", "/setup", {"code": code, "password": "short", "again": "short"}).status == 400
    made = hosted.call("POST", "/setup", {"code": code, "password": PASSWORD, "again": PASSWORD})
    assert made.status == 303 and made.headers["location"] == "/"
    cookie = made.headers["set-cookie"]
    assert "Secure" in cookie and "HttpOnly" in cookie and "SameSite=Strict" in cookie
    token = cookie.split(";")[0].split("=", 1)[1]
    assert hosted.call("POST", "/setup", {"code": code, "password": PASSWORD, "again": PASSWORD}).headers["location"] == "/login"
    viewer = hosted.call("GET", "/api/identity", Cookie=f"{COOKIE}={token}")
    assert viewer.status == 200 and json.loads(viewer.text)
    assert "Strict-Transport-Security".lower() in viewer.headers and "access-control-allow-origin" not in viewer.headers
    assert "<div id=\"app\">" in hosted.call("GET", "/", Cookie=f"{COOKIE}={token}").text
    folder = hosted.vault.folder
    assert not folder.is_relative_to(hosted.record.root.resolve().parent)
    assert {path.stat().st_mode & 0o777 for path in (folder.parent, folder)} == {0o700} and (folder / LOGINS).stat().st_mode & 0o777 == 0o600
    logged = (folder / AUDIT).read_text()
    assert "owner password set" in logged and PASSWORD not in logged and code not in logged and token not in logged
    shares = Shares(hosted.record, actor=SYSTEM)
    assert shares._address() == ADDRESS and shares.tunnel()["problems"] == []
    assert SERVER in [spec.id for spec in share_services(hosted.record.root, set())]
    Features(hosted.record, actor=USER).configure(HostedJournalDetails.name, "apart", "true")
    assert share_services(hosted.record.root, set()) == [], "a login page run apart under its own user is never started by the journal"


def test_five_wrong_passwords_lock_a_place_out_across_a_restart_until_fifteen_minutes_pass(hosted):
    Owner(hosted.vault).set_password(PASSWORD)
    for _ in range(MOST_TRIES - 1):
        assert hosted.call("POST", "/login", {"password": "wrong"}).status == 401
    assert "Too many wrong tries" in hosted.call("POST", "/login", {"password": "wrong"}).text
    assert hosted.call("POST", "/login", {"password": PASSWORD}).status == 429
    assert hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="203.0.113.9").status == 429, "only the proxy names a new place"
    Features(hosted.record, actor=USER).configure(HostedJournalDetails.name, "proxy", "127.0.0.1")
    proxied = {"Host": ADDRESS, "Origin": f"https://{ADDRESS}", "X_Forwarded_Proto": "https"}
    trusted = hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="203.0.113.9", **proxied)
    assert trusted.status == 303
    device = next(line.split(";")[0] for line in trusted.headers["set-cookie"].splitlines() if line.startswith(DEVICE_COOKIE))
    for _ in range(MOST_TRIES):
        hosted.call("POST", "/login", {"password": "wrong"}, X_Forwarded_For="2001:db8::1", **proxied)
    assert hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="2001:db8::ffff", **proxied).status == 429, "IPv6 counts by /64"
    now = [1000.0]
    tries = WrongTries(Vault(hosted.record.root, clock=lambda: now[0]))
    with ThreadPoolExecutor(20) as pool:
        waits = list(pool.map(lambda _: tries.counted("198.51.100.1"), range(20)))
    assert waits.count(0.0) == MOST_TRIES, "guesses sent at once are each counted before any is checked"
    assert WrongTries(Vault(hosted.record.root, clock=lambda: now[0])).locked_for("198.51.100.1") == LOCKED_FOR
    now[0] += LOCKED_FOR + 1
    assert WrongTries(Vault(hosted.record.root, clock=lambda: now[0])).locked_for("198.51.100.1") == 0
    for place in range(MOST_EVERYWHERE):
        tries.counted(f"10.0.{place // 250}.{place % 250}")
    assert tries.locked_for("192.0.2.200") > 0, "too many wrong tries from every place together lock out every place"
    for place in range(MOST_EVERYWHERE):
        WrongTries(hosted.vault).counted(f"10.1.{place // 250}.{place % 250}")
    assert hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="203.0.113.77", **proxied).status == 429
    assert hosted.call("GET", "/login", X_Forwarded_For="203.0.113.77", **proxied).status == 429
    shown = hosted.call("GET", "/login", X_Forwarded_For="203.0.113.77", Cookie=device, **proxied)
    assert shown.status == 200 and "Log in</button>" in shown.text, "a known browser sees the login form during a flood"
    assert hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="203.0.113.77", Cookie=device, **proxied).status == 303, \
        "a browser that logged in before is never locked out by wrong tries from elsewhere"
    assert "cleared" in clear_tries(hosted.record.root)
    assert hosted.call("POST", "/login", {"password": PASSWORD}, X_Forwarded_For="203.0.113.78", **proxied).status == 303


def test_a_login_that_ran_out_sends_the_page_and_the_viewer_back_to_log_in(hosted):
    Owner(hosted.vault).set_password(PASSWORD)
    old = Logins(Vault(hosted.record.root, clock=lambda: 0.0)).open(7, "old phone")
    page = hosted.call("GET", "/", Cookie=f"{COOKIE}={old}")
    assert page.status == 303 and page.headers["location"] == "/login?notice=ran-out"
    api = hosted.call("GET", "/api/identity", Cookie=f"{COOKIE}={old}")
    assert api.status == 401 and json.loads(api.text)["login"] == "/login?notice=ran-out"
    assert "Your login ran out" in hosted.call("GET", "/login?notice=ran-out").text
    assert hosted.call("GET", "/").headers["location"] == "/login"


def test_the_gateway_refuses_run_upgrade_stop_and_hook_for_the_owner_and_logs_each_refusal(hosted):
    token = hosted.logged_in()
    origin = f"http://127.0.0.1:{hosted.port}"
    closed = ("/api/run", "/api/upgrade", "/api/stop", "/api/hook/claude", "/api/update", "/api/journals/start", "/api/services/sharing.server")
    encoded = ("/api/%72un", "/api/upgr%61de", "/api/st%6fp", "/api/hoo%6b/claude", "/api/upd%61te")
    for path in (*closed, *encoded):
        assert hosted.call("POST", path, {}, Cookie=f"{COOKIE}={token}", Origin=origin).status == 403, path
    code = Phones(hosted.record, actor=USER).connect(7)["link"].rsplit("#", 1)[1]
    phone_headers = {"Origin": origin, "X-Phone": "1", "Content-Type": "application/json"}
    forged = {**phone_headers, "Host": ADDRESS, "Origin": f"https://{ADDRESS}", "X-Forwarded-Proto": "https", "X-Forwarded-For": "203.0.113.4"}
    assert hosted.call("POST", "/p/pair", body=json.dumps({"code": code, "device": "phone"}), **forged).status == 403, "the phone too trusts only the named proxy"
    paired = hosted.call("POST", "/p/pair", body=json.dumps({"code": code, "device": "phone"}), **phone_headers)
    key = paired.headers["set-cookie"].split(";")[0]
    for path in ("/p/api/upgrade", "/p/api/st%6fp", "/p/api/update"):
        refused = hosted.call("POST", path, body="{}", Cookie=key, **phone_headers)
        assert refused.status == 403 and "never runs this" in refused.text, path
    assert hosted.call("POST", "/logout", {}, Cookie=f"{COOKIE}={token}").headers["location"] == "/login?notice=logged-out"
    assert hosted.call("GET", "/api/identity", Cookie=f"{COOKIE}={token}").status == 401
    logged = [json.loads(line) for line in (hosted.vault.folder / AUDIT).read_text().splitlines()]
    assert {line["path"] for line in logged if line["what"] == "refused"} >= {*closed, *encoded}


def test_another_site_plain_http_from_outside_a_strange_host_large_bodies_and_too_many_streams_are_refused(hosted):
    token = hosted.logged_in()
    assert hosted.call("POST", "/api/main/todo", {"title": "x"}, Cookie=f"{COOKIE}={token}", Origin="https://evil.example").status == 403
    assert hosted.call("POST", "/login", {"password": PASSWORD}, Origin="https://evil.example").status == 403
    outside = type("Outside", (), {"shares": Shares(hosted.record, actor=SYSTEM), "path": "/", "client_address": ("203.0.113.5", 4000),
                                   "headers": {"Host": "localhost", "X-Forwarded-Proto": "https", "X-Forwarded-For": "198.51.100.7"}})
    visit = Visit(outside, RefusalLog(1), FromRecord())
    assert not visit.secure() and visit.place() == "203.0.113.5", "a peer that is not the named proxy decides neither https, locality nor its place"
    forged = {"Host": ADDRESS, "Cookie": f"{COOKIE}={token}", "X_Forwarded_Proto": "https", "X_Forwarded_For": "203.0.113.9"}
    Features(hosted.record, actor=USER).configure(HostedJournalDetails.name, "proxy", "127.0.0.1")
    assert hosted.call("GET", "/api/identity", **forged).status == 200
    assert "only over https" in hosted.call("GET", "/", **{**forged, "X_Forwarded_Proto": "http"}).text
    assert hosted.call("GET", "/api/identity", **{**forged, "Host": "journal.evil.example"}).status == 421
    origin = f"http://127.0.0.1:{hosted.port}"
    origin = f"http://127.0.0.1:{hosted.port}"
    big = hosted.call("POST", "/api/main/todo", {"title": "x"}, Cookie=f"{COOKIE}={token}", Origin=origin, Content_Length=str(2 * 1024 * 1024))
    assert big.status == 413
    gateway = ROUTES.keyed(hosted.record)[EVERY_OTHER]
    gateway.streams[hashed(token)] = MOST_STREAMS
    assert hosted.call("GET", "/api/main/events", Cookie=f"{COOKIE}={token}", Accept="text/event-stream").status == 429
    gateway.streams.clear()
    held = [gateway.checking.acquire() for _ in range(CHECKS_AT_ONCE)]
    assert hosted.call("POST", "/login", {"password": PASSWORD}).status == 429 and all(held)
    for _ in held:
        gateway.checking.release()
    assert hosted.call("POST", "/login", {"password": PASSWORD}).status == 303


def test_a_full_disk_refuses_the_write_and_leaves_the_kept_file_whole(hosted, monkeypatch, tmp_path):
    monkeypatch.setenv(VAULT, str(tmp_path / "vault"))
    assert Vault(hosted.record.root).folder.parent == tmp_path / "vault"
    monkeypatch.delenv(VAULT)
    token = hosted.logged_in()
    kept = (hosted.vault.folder / LOGINS).read_text()

    def full(*_):
        raise OSError(errno.ENOSPC, "No space left on device")
    monkeypatch.setattr(disk.os, "replace", full)
    with pytest.raises(DiskFull):
        Logins(hosted.vault).open(7, "another")
    assert (hosted.vault.folder / LOGINS).read_text() == kept and token
    assert not [path for path in hosted.vault.folder.iterdir() if path.name.startswith(".")]
    assert hosted.call("POST", "/login", {"password": PASSWORD}).status == 507
    monkeypatch.undo()
    now = [6000.0]
    refusals = RefusalLog(3, clock=lambda: now[0])
    for _ in range(10):
        refusals.write(hosted.vault, place="203.0.113.1", code=421)
    now[0] += 60
    refusals.write(hosted.vault, place="203.0.113.1", code=421)
    logged = [json.loads(line) for line in (hosted.vault.folder / AUDIT).read_text().splitlines()]
    assert [line["what"] for line in logged[-5:]] == ["refused"] * 3 + ["refusals not logged", "refused"] and logged[-2]["count"] == 7
    assert Owner(hosted.vault).matches(PASSWORD) and json.loads((hosted.vault.folder / "owner.json").read_text())["cost"] == 2 ** 17


@pytest.mark.skipif(not (WEB / "node_modules" / "playwright-core").is_dir(), reason="the viewer's npm packages are not installed")
def test_login_failed_rate_limited_and_ran_out_show_in_a_browser(hosted):
    Owner(hosted.vault).set_password(PASSWORD)
    old = Logins(Vault(hosted.record.root, clock=lambda: 0.0)).open(7, "old")
    env = {**os.environ, "HOSTED_URL": f"http://127.0.0.1:{hosted.port}/", "HOSTED_PASSWORD": PASSWORD, "HOSTED_OLD_LOGIN": old}
    run = subprocess.run(["node", "browser/hosted/login.mjs"], cwd=WEB, env=env, capture_output=True, text=True, timeout=SCENARIOS_WAIT)
    assert run.returncode == 0, run.stderr[-2000:]
    assert json.loads(run.stdout.strip().splitlines()[-1]) == {}


def test_a_server_starts_no_more_agents_than_its_setting_allows(hosted, monkeypatch):
    monkeypatch.setattr(Sessions, "running", lambda sessions: ["claude-1", "claude-2"])
    refuse_past_cap(hosted.record.root)
    Features(hosted.record, actor=USER).configure(HostedJournalDetails.name, "agents", "2")
    with pytest.raises(TooManyAgents, match="2 agents already run here"):
        refuse_past_cap(hosted.record.root)
    Features(hosted.record, actor=USER).switch(HostedJournalDetails.name, False)
    refuse_past_cap(hosted.record.root)


def test_a_login_page_run_apart_trusts_nothing_the_record_says(hosted, monkeypatch, tmp_path):
    monkeypatch.setenv(VAULT, str(tmp_path / "vault"))
    root = hosted.record.root
    keep_gateway_settings(root, GatewaySettings(ADDRESS, "", 7))
    Owner(Vault(root)).set_password(PASSWORD)
    listening = socket.create_server(("127.0.0.1", 0))
    env = {**os.environ, APART: "1", "PYTHONPATH": str(SRC), "PYTHONSAFEPATH": "1"}
    child = subprocess.Popen([sys.executable, "-P", "-m", "features.hosted_journal.apart", "serve", str(root), "--fd", str(listening.fileno())],
                             pass_fds=(listening.fileno(),), env=env, cwd="/", stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        apart = Hosted(hosted.record, listening.getsockname()[1], Vault(root))
        began = time.time()
        while time.time() - began < APART_WAIT and apart.call("GET", "/login").status != 200:
            time.sleep(0.2)
        origin = f"http://127.0.0.1:{apart.port}"
        Features(hosted.record, actor=USER).configure(HostedJournalDetails.name, "proxy", "127.0.0.1")
        forged = {"Host": ADDRESS, "Origin": f"https://{ADDRESS}", "X_Forwarded_Proto": "https", "X_Forwarded_For": "203.0.113.9"}
        assert apart.call("POST", "/login", {"password": PASSWORD}, **forged).status == 403, "a proxy named in the record is not trusted"
        Phones(hosted.record, actor=SYSTEM)._kept(Phones(hosted.record, actor=SYSTEM).create("A forged phone").n,
                                                  key=hashed("forged"), expires=time.time() + DAY, environment="main")
        assert apart.call("GET", "/p/state", Cookie="__Host-phone=forged").status == 401, "a phone written into the record opens nothing"
        token = apart.call("POST", "/login", {"password": PASSWORD}).headers["set-cookie"].split(";")[0]
        made = json.loads(apart.call("POST", "/api/main/phone/connect", body='{"days": 7}', Cookie=token, Origin=origin, Content_Type="application/json").text)
        assert made["link"].startswith(f"https://{ADDRESS}/p/#")
        phone_headers = {"Origin": origin, "X-Phone": "1", "Content-Type": "application/json"}
        paired = apart.call("POST", "/p/pair", body=json.dumps({"code": made["link"].rsplit("#", 1)[1], "device": "phone"}), **phone_headers)
        key = paired.headers["set-cookie"].split(";")[0]
        assert apart.call("GET", "/p/state", Cookie=key).status == 200
        assert Phones(hosted.record, actor=SYSTEM).load(made["n"]).key == KEPT_ELSEWHERE and str(made["n"]) in Vault(root).read(PHONES)
        Features(hosted.record, actor=USER).switch(HostedJournalDetails.name, False)
        assert apart.call("GET", "/login").status == 200 and apart.call("POST", "/api/run", body="{}", Cookie=token, Origin=origin).status == 403
    finally:
        child.terminate()
        child.wait(APART_WAIT)
