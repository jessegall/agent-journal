import hashlib
import json
import os
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from dataclasses import asdict
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import NamedTuple

import pytest

from controllers.base import Controller
from controllers.features import Features
from controllers.types import CONTROLLERS, Agents, Comments, Docs, Environments, Messages, Notices, Questions, Todos
from engine.record import Record
from features.phone import allow_list, push
from features.phone import controller as phone_controller
from features.phone.passkey import Assertion, Cbor, Enrolment, Unverified, encoded, integer, requested
from features.phone.controller import Phones
from features.phone.feed import POSTED
from features.helpers.controller import Helpers
from features.tickets.controller import Tickets
from features.sharing.controller import Shares
from features.suggestions.controller import Suggestions
from features.sharing.details import SharingDetails
from features.sharing.server import ShareHandler
from engine.viewer import SERVING
from serve import Handler, JournalServer
from features.sharing.services import wanted
from resources.base import OWNER_ID, AGENT, SYSTEM, USER, Refused
from resources.types import EnvironmentKind
from tests.conftest import fresh


@pytest.fixture
def served():
    import features
    features.load()
    record = fresh()
    Features(record, actor=USER).configure(SharingDetails.name, "host", "t.example")
    handler = type("Bound", (ShareHandler,), {"shares": Shares(record, actor=SYSTEM)})
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield record, f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


class Answer(NamedTuple):
    status: int
    body: dict
    cookie: str


def call(base: str, path: str, body: dict | None = None, key: str | None = None, method: str | None = None, **headers) -> Answer:
    sent = {"Origin": base, "X-Phone": "1", "Content-Type": "application/json", **headers}
    if key is not None:
        sent["Cookie"] = f"__Host-phone={key}"
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(f"{base}{path}", data, {k: v for k, v in sent.items() if v}, method=method or ("POST" if data else "GET"))
    try:
        with urllib.request.urlopen(request, timeout=5) as got:
            body = json.loads(got.read()) if got.headers.get_content_type() == "application/json" else {}
            return Answer(got.status, body, got.headers.get("Set-Cookie", ""))
    except urllib.error.HTTPError as error:
        return Answer(error.code, json.loads(error.read() or b"{}") if error.headers.get_content_type() == "application/json" else {}, "")


def cbor(value) -> bytes:
    def head(major: int, size: int) -> bytes:
        return bytes([major << 5 | size]) if size < 24 else bytes([major << 5 | 25]) + size.to_bytes(2, "big")
    if isinstance(value, int):
        return head(0, value) if value >= 0 else head(1, -1 - value)
    if isinstance(value, bytes):
        return head(2, len(value)) + value
    if isinstance(value, str):
        return head(3, len(value.encode())) + value.encode()
    return head(5, len(value)) + b"".join(cbor(key) + cbor(item) for key, item in value.items())


class Authenticator:
    """A phone's platform authenticator in software: one P-256 passkey for one site, answering with Face ID passed."""

    def __init__(self, origin: str) -> None:
        self.keys, self.origin, self.count, self.id = push.Keys.made(), origin, 0, os.urandom(16)

    def data(self, flags: int) -> bytes:
        self.count += 1
        site = self.origin.split("//", 1)[1].split(":", 1)[0]
        return hashlib.sha256(site.encode()).digest() + bytes([flags]) + self.count.to_bytes(4, "big")

    def client(self, kind: str, challenge: str) -> bytes:
        return json.dumps({"type": kind, "challenge": challenge, "origin": self.origin}).encode()

    def made(self, challenge: str) -> Enrolment:
        public = self.keys.public
        key = cbor({1: 2, 3: -7, -1: 1, -2: public[1:33], -3: public[33:]})
        data = self.data(0x45) + bytes(16) + len(self.id).to_bytes(2, "big") + self.id + key
        return Enrolment(encoded(self.client("webauthn.create", challenge)), encoded(cbor({"fmt": "none", "attStmt": {}, "authData": data})))

    def signed(self, challenge: str) -> Assertion:
        data, client = self.data(0x05), self.client("webauthn.get", challenge)
        raw = self.keys.signed(data + hashlib.sha256(client).digest())
        parts = [b"\x00" * (part[0] >= 0x80) + part.lstrip(b"\x00") for part in (raw[:32], raw[32:])]
        der = b"".join(b"\x02" + bytes([len(part)]) + part for part in parts)
        return Assertion(encoded(self.id), encoded(client), encoded(data), encoded(b"\x30" + bytes([len(der)]) + der))


class Paired(NamedTuple):
    n: int
    key: str


def paired(record, base: str, days: int = 7) -> Paired:
    made = Phones(record, actor=USER).connect(days)
    got = call(base, "/p/pair", {"code": made["link"].split("#", 1)[1], "device": "iPhone, Safari"})
    assert got.status == 200 and all(part in got.cookie for part in ("HttpOnly", "Secure", "SameSite=Strict")), got
    return Paired(made["n"], got.cookie.split(";", 1)[0].split("=", 1)[1])


def test_a_code_connects_once_and_a_look_at_it_does_not_use_it(served):
    record, base = served
    guessed = Phones(record, actor=USER).connect(7)
    for _ in range(10):
        call(base, "/p/pair", {"code": "wrong-guess", "device": "Pixel"})
    assert call(base, "/p/pair", {"code": guessed["link"].split("#", 1)[1], "device": "Pixel"})[0] == 410, \
        "ten wrong codes cancel the code that was waiting"
    earlier = Phones(record, actor=USER).connect(7)
    made = Phones(record, actor=USER).connect(7)
    assert Phones(record, actor=SYSTEM).load(earlier["n"]).completed, "a new code replaces the one that was never used"
    code = made["link"].split("#", 1)[1]
    assert made["link"].startswith("https://") and "/p/#" in made["link"], "the code rides in the fragment, which never reaches a server"
    call(base, "/p/", method="HEAD")
    call(base, "/p/")
    assert call(base, "/p/pair", {"code": code, "device": "Pixel"})[0] == 200, "looking at the page first does not use the code up"
    assert call(base, "/p/pair", {"code": code, "device": "Other"})[0] == 410, "a code connects one phone, once"
    assert any("A phone connected" in row["title"] for row in Notices(record, actor=SYSTEM).rows.summaries()), "a new phone is announced in the chat"
    with pytest.raises(Refused):
        Phones(record, actor=USER).connect(7)


def test_a_message_from_the_phone_is_the_users_own(served):
    record, base = served
    n, key = paired(record, base)
    status, made, _ = call(base, "/p/message", {"brief": "Carry on with the tests", "idempotency": "a1"}, key)
    assert status == 201, status
    call(base, "/p/message", {"brief": "Carry on with the tests", "idempotency": "a1"}, key)
    message = Messages(record, actor=SYSTEM).load(made["n"])
    assert message.seen[:1] == [USER] and message.data["via"] == f"phone:{n}", "it is recorded as the user, naming the phone"
    script = Path(__file__).resolve().parents[2] / "journal.py"
    subprocess.run([sys.executable, str(script), "--root", str(record.root), "--env", record.env, "--as", AGENT, "message", "read", str(made["n"])],
                   capture_output=True, timeout=60, check=True)
    ticked = [item for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == f"message:{made['n']}"]
    assert ticked and "agent" in ticked[0]["seen"], "a read made in another process shows on the phone's next poll, so its ticks change"
    assert len([m for m in Messages(record, actor=SYSTEM).rows.summaries() if m.get("idempotency") == "a1"]) == 1, "a resend is one message"
    nods = {Messages(record, actor=AGENT).create(f"Noted {i}.", brief=f"Noted {i}.", acknowledgement=True).ref for i in range(45)}
    refs = {item["ref"] for item in call(base, "/p/feed", key=key).body["items"]}
    assert (f"message:{made['n']}" in refs, refs & nods) == (True, set()), \
        "hidden acknowledgements are left out before the feed counts its page, so they never push a real message out"
    upload = lambda n, kind="application/octet-stream": urllib.request.urlopen(urllib.request.Request(
        f"{base}/p/attach/{n}/photo.jpg", b"\xff\xd8picture", {"Origin": base, "X-Phone": "1", "Content-Type": kind, "Cookie": f"__Host-phone={key}"},
        method="POST"), timeout=5).status
    assert upload(made["n"]) == 201 and "photo.jpg" in Messages(record, actor=SYSTEM).load(made["n"]).files, "a photo goes onto the phone's message"
    sent = lambda path, data, kind="application/json": urllib.request.Request(
        f"{base}{path}", data, {"Origin": base, "X-Phone": "1", "Content-Type": kind, "Cookie": f"__Host-phone={key}"}, method="POST")
    for request, status in ((sent("/p/message", b"not json"), 422), (sent("/p/attach/x/photo.jpg", b"bytes", "application/octet-stream"), 413), (sent(f"/p/attach/{made['n']}/photo.jpg", b"", "application/octet-stream"), 413)):
        with pytest.raises(urllib.error.HTTPError) as refusal:
            urllib.request.urlopen(request, timeout=5)
        assert refusal.value.code == status, f"{request.full_url} is answered with {status}, because a body that is not JSON says nothing and a file needs a message and some bytes"
    fetched = urllib.request.urlopen(urllib.request.Request(f"{base}/p/file/message/{made['n']}/photo.jpg", headers={"Cookie": f"__Host-phone={key}"}), timeout=5)
    assert fetched.read() == b"\xff\xd8picture", "and opens again from the phone"
    assert call(base, f"/p/file/message/{made['n']}/..%2F..%2Fsecret", key=key).status == 404, "and nothing outside the message's own files"
    other = Messages(record, actor=USER).create("from the computer", brief="from the computer")
    with pytest.raises(urllib.error.HTTPError):
        upload(other.n)
    with pytest.raises(urllib.error.HTTPError):
        upload(made["n"], "text/plain")
    assert call(base, "/p/react", {"n": made["n"], "face": "👍"}, key).status == 201
    reacted = [item for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == f"message:{made['n']}"]
    assert reacted and reacted[0]["reactions"] == [{"face": "👍", "who": USER}], "a reaction from the phone is the user's and shows on the message"
    fetch = lambda path, **sent: urllib.request.urlopen(urllib.request.Request(f"{base}{path}", headers={"Cookie": f"__Host-phone={key}", **sent}), timeout=5)
    with pytest.raises(urllib.error.HTTPError) as unchanged:
        fetch("/p/feed", **{"If-None-Match": fetch("/p/feed").headers["ETag"]})
    assert unchanged.value.code == 304, "an unchanged feed is not sent again"
    assert fetch("/p/", **{"Accept-Encoding": "gzip"}).headers["Content-Encoding"] == "gzip", "the app travels compressed"
    Messages(record, actor=AGENT).reply(made["n"], "Yes, that is done")
    replied = [item for item in call(base, "/p/feed", key=key).body["items"] if item["type"] == "comment"]
    assert replied and "that is done" in replied[-1]["brief"] and replied[-1]["who"] == AGENT, "the agent's reply to a message reaches the phone"
    assert call(base, "/p/react", {"n": replied[-1]["n"], "type": "comment", "face": "🎩"}, key).status == 201
    tipped = [item for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == replied[-1]["ref"]]
    assert tipped[0]["reactions"] == [{"face": "🎩", "who": USER}], "a reply takes a reaction from the phone like a message"
    older = call(base, f"/p/feed?before={message.created}", key=key).body["items"]
    assert all(item["created"] < message.created for item in older), "an older page holds only what came before it"
    spoken = {"message": lambda: Messages(record, actor=AGENT).create("the build is green"),
              "question": lambda: Questions(record, actor=AGENT).create("Which port should it use", options=[{"title": "8421"}, {"title": "8422"}], pick=1),
              "comment": lambda: Comments(record, actor=AGENT).create("noted on the message", refs=[f"message:{made['n']}"]),
              "suggestion": lambda: Suggestions(record, actor=AGENT).create("Keep the file list between searches")}
    assert set(spoken) == set(POSTED), "every kind the phone's chat speaks is checked below"
    for kind, make in spoken.items():
        row = make()
        fed = {item["ref"] for item in call(base, "/p/feed", key=key).body["items"]}
        assert row.ref in fed, f"a {kind} the agent writes reaches the phone's chat"
    agents = Agents(record, actor=SYSTEM)
    lead = agents.primary() or agents.create("claude-1")
    agents.update(lead.n, subagent_rows=[{"task_id": "t-7", "task": "Ada: map the hooks"}])
    handed = Messages(record, actor=AGENT).create("for Ada", brief="for Ada", sent_to="t-7")
    assert [item["to"] for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == handed.ref] == ["Ada: map the hooks"], \
        "a message sent to a subagent names it on the phone"


def test_a_write_from_anywhere_but_the_phone_page_is_refused(served, monkeypatch, tmp_path):
    record, base = served
    n, key = paired(record, base)
    words = {"brief": "Delete everything", "idempotency": "x"}
    assert call(base, "/p/message", words, key, Origin="https://evil.example")[0] == 403, "another site cannot make the phone act"
    assert call(base, "/p/message", words, key, **{"X-Phone": ""})[0] == 403, "a write needs the phone page's header"
    assert call(base, "/p/message", words, key, **{"Content-Type": "text/plain"})[0] == 403, "a form post is refused"
    assert call(base, "/p/message", words, "not-a-key")[0] == 401, "a guessed key opens nothing"
    assert call(base, "/p/", {}, key)[0] == 404, "a phone post without an action has no route"
    assert not [m for m in Messages(record, actor=SYSTEM).rows.summaries() if m.get("idempotency") == "x"]
    desk = JournalServer(("127.0.0.1", 0), type("Desk", (Handler,), {"root": record.root}))
    threading.Thread(target=desk.serve_forever, daemon=True).start()
    SERVING[str(record.root.resolve())] = f"http://127.0.0.1:{desk.server_port}/"
    try:
        made = {"title": "From the phone"}
        assert call(base, f"/p/api/{record.env}/todo", made)[0] == 401, "the desktop's pages need the phone's key"
        assert call(base, f"/p/api/{record.env}/todo", made, "not-a-key")[0] == 401
        assert call(base, f"/p/api/{record.env}/todo", made, key, Origin="https://evil.example")[0] == 403
        assert call(base, "/p/api/elsewhere/todo", made, key)[0] == 403, "another environment stays closed"
        assert call(base, "/p/api/summary?env=elsewhere", key=key)[0] == 403
        assert call(base, "/p/api/run", made, key)[0] == 403, "a page the phone app never calls is refused"
        assert [call(base, f"/p/api/{record.env}/{page}", {**made, "entry": "touch x"}, key)[0] for page in ("tool", "agent/main/shell", "phone/connect")] == [428, 428, 403], \
            "running a command waits for Face ID, and phones are never the phone's to change"
        seed = {"name": "critique", "key": "seed", "value": "touch x"}
        assert [call(base, f"/p/api/{record.env}/{page}", asked, key)[0] for page, asked in (
            ("critique/round", {"what": "the phone"}), ("feature/configure", seed), ("settings", {"critique": {"seed": "touch x"}}),
            ("sequence/run", {"n": 1}), ("agent/main/relaunch", {"skip": True}))] == [403, 403, 428, 428, 428], \
            "a phone runs or sets a command, in any shape of the page, or restarts the agent without permission prompts, only after Face ID"
        assert call(base, f"/p/api/{record.env}/agent/main/relaunch", {}, key)[0] != 403, "a restart that keeps the prompts passes"
        assert [call(base, f"/p/api/{record.env}/settings", written, key)[0] for written in (
            {"form_of_address": {"title": "Captain"}}, {"viewer": {"chat_hidden": ["thoughts"], "color_scheme": "dark"}}, {"viewer": {"open_with": "sh"}},
            {"critique": {"login": "state.json", "seed": ""}})] == [200, 200, 428, 200], \
            "the phone writes the settings it names, and a command it sends back unchanged sets nothing"
        run, face, other = f"/p/api/{record.env}/check/999/run", Authenticator(base), Authenticator(base)

        def unlocked(path: str = run, by: Authenticator = face) -> tuple[str, dict]:
            signed = asdict(by.signed(call(base, "/p/unlock/begin", {"request": requested("POST", path, b"{}")}, key).body["challenge"]))
            return call(base, "/p/unlock", signed, key).body.get("unlock", ""), signed

        assert call(base, run, {}, key).body["unlock"] and call(base, "/p/unlock/begin", {"request": "x"}, key).status == 422, \
            "a command run waits for Face ID, and a phone without its passkey has nothing to unlock with"
        def enrolled() -> Answer:
            return call(base, "/p/passkey", asdict(face.made(call(base, "/p/passkey/begin", {}, key).body["challenge"])), key)

        def asking() -> list[str]:
            return [row.title for row in Notices(record, actor=SYSTEM).rows.standing() if row.data.get("action") == "passkey"]

        users = Phones(record, actor=USER)
        assert enrolled().body == {"passkey": False, "allow_within": 120} and not users.load(n).passkey \
            and call(base, "/p/unlock/begin", {"request": "x"}, key).status == 422 and enrolled().status == 422, \
            "a phone's cookie alone sets up no passkey, and a second ask waits for the first"
        assert asking() == ["Set up Face ID for phone iPhone, Safari?"] and call(base, "/p/state", key=key).body["passkey_asked"]
        assert [call(base, f"/p/api/{record.env}/phone/{n}/{word}", {}, key).status for word in ("allow_passkey", "refuse_passkey")] == [403, 403], \
            "the phone cannot answer its own ask"
        with pytest.raises(Refused):
            Phones(record, actor=AGENT).allow_passkey(n)
        users.refuse_passkey(n)
        assert not users.load(n).passkey and asking() == [], "a refused passkey is dropped with its card"
        enrolled()
        later = time.time() + 121
        monkeypatch.setattr(phone_controller, "time", type("Later", (), {"time": staticmethod(lambda: later)}))
        with pytest.raises(Refused):
            users.allow_passkey(n)
        monkeypatch.undo()
        enrolled()
        assert users.allow_passkey(n).passkey and asking() == [] and call(base, "/p/passkey/begin", {}, key).status == 422 \
            and "Face ID was set up for phone iPhone, Safari" in [row.title for row in Notices(record, actor=SYSTEM).rows.standing()], \
            "Allow on the computer within two minutes keeps the passkey once, and says so"
        for broken in (b"\xc0\x00", b"\xa1\x01\xc1\x00", b"\x1c"):
            with pytest.raises(Unverified):
                Cbor(broken).item()
        with pytest.raises(Unverified):
            integer(b"\x02\x02\x00\x7f")
        assert integer(b"\x02\x02\x00\x80") == (0x80, b""), "a tag or a padded number is refused, a needed zero is not"
        other.id = face.id
        assert unlocked(by=other)[0] == "", "another key answering for this phone's passkey unlocks nothing"
        unlock, signed = unlocked()
        assert call(base, "/p/unlock", signed, key).status == 422, "a replayed answer unlocks nothing"
        assert call(base, run, {}, key, **{"X-Phone-Unlock": "guessed"}).status == 428, "a guessed unlock opens nothing"
        assert call(base, run, {}, key, **{"X-Phone-Unlock": unlock}).status not in (403, 428), "a fresh unlock lets the run through"
        assert call(base, run, {}, key, **{"X-Phone-Unlock": unlock}).status == 428, "and only once"
        assert call(base, f"/p/api/{record.env}/tool/999/run", {}, key, **{"X-Phone-Unlock": unlocked()[0]}).status == 428, \
            "an unlock opens only the request it was asked for"
        unlock, later = unlocked()[0], time.time() + 120
        monkeypatch.setattr(phone_controller, "time", type("Later", (), {"time": staticmethod(lambda: later)}))
        assert call(base, run, {}, key, **{"X-Phone-Unlock": unlock}).status == 428, "an unlock older than a minute opens nothing"
        monkeypatch.undo()
        assert call(base, f"/p/api/{record.env}/settings", {"boards": {"filler_model": "opus\ntools: Bash"}}, key)[0] == 400, \
            "a model the provider does not offer is not written"
        kept = Controller.create(CONTROLLERS["worktree"](record, actor=SYSTEM), "shed", path="/kept")
        assert call(base, f"/p/api/{record.env}/worktree/{kept.n}/update", {"path": "/"}, key)[0] == 400 \
            and CONTROLLERS["worktree"](record, actor=SYSTEM).load(kept.n).path == "/kept", "a path the journal sets is never written by hand"
        place = Environments(record, actor=SYSTEM).create("placed", folder="/kept")
        agent = Agents(record, actor=SYSTEM).create("hooked", transcript="/kept.jsonl")
        ticket = Tickets(record, actor=SYSTEM).create("carded", work_environment="placed")
        assert [call(base, f"/p/api/{record.env}/{page}", written, key)[0] for page, written in (
            ("environment", {"title": "elsewhere", "folder": "/"}), (f"environment/{place.n}/update", {"folder": "/"}),
            (f"environment/{place.n}/update", {"owner": "helper:1"}), (f"agent/{agent.n}/update", {"transcript": "/etc/passwd"}),
            (f"agent/{agent.n}/update", {"cwd": "/"}), (f"ticket/{ticket.n}/update", {"work_environment": "main"}),
            (f"ticket/{ticket.n}/update", {"bases": {"x": "y"}}), (f"ticket/{ticket.n}/update", {"provider": "nope"}))] == [400] * 8 \
            and (Environments(record, actor=SYSTEM).load(place.n).folder, Agents(record, actor=SYSTEM).load(agent.n).transcript,
                 Tickets(record, actor=SYSTEM).load(ticket.n).provider) == ("/kept", "/kept.jsonl", "claude"), \
            "a phone sets no folder, transcript, work environment or base, and no provider the journal cannot start"
        status, answered, _ = call(base, f"/p/api/{record.env}/todo", made, key)
        assert status == 201 and Todos(record, actor=SYSTEM).load(answered["n"]).seen[:1] == [USER], "the phone writes as the user"
        row = f"/p/api/{record.env}/todo/{answered['n']}"
        assert call(base, row, key=key).body["title"] == "From the phone"
        assert call(base, "/p/api/changelog", key=key).body["changelog"], "About on the phone reads the changelog"
        assert call(base, f"{row}/move", {"env": "elsewhere"}, key)[0] == 403 and Todos(record, actor=SYSTEM).load(answered["n"]), \
            "a body that names an environment outside this journal is refused"
        for name in ("page.html", "face.png"):
            (tmp_path / name).write_text("<script src=x.js></script>")
            Todos(record, actor=SYSTEM).attach(answered["n"], str(tmp_path / name))
        assert call(base, f"{row}/files/page.html", key=key)[0] == 403, "a page the phone app does not call is refused"
        monkeypatch.setattr(allow_list, "NAMED", allow_list.NAMED | {allow_list.Action("todo", "files")})
        sent = {"Cookie": f"__Host-phone={key}"}
        with urllib.request.urlopen(urllib.request.Request(f"{base}{row}/files/page.html", headers=sent), timeout=5) as got:
            assert (got.headers["X-Content-Type-Options"], got.headers["Content-Disposition"].split(";")[0]) == ("nosniff", "attachment"), \
                "a forwarded file is downloaded, never opened on the phone's own origin"
        with urllib.request.urlopen(urllib.request.Request(f"{base}{row}/files/face.png", headers=sent), timeout=5) as got:
            assert got.headers["Content-Disposition"].split(";")[0] == "inline", "a picture still shows in place"
        with socket.create_connection(("127.0.0.1", int(base.rsplit(":", 1)[1])), timeout=5) as raw:
            raw.sendall(f"GET {row}/files/caf\xe9\x01 HTTP/1.1\r\nHost: x\r\nCookie: __Host-phone={key}\r\nConnection: close\r\n\r\n".encode("latin-1"))
            assert raw.recv(64).split(b" ")[1] == b"404", "a path with a raw or control character is answered, not dropped"
        CONTROLLERS["environment"](record, actor=SYSTEM).create("garden")
        moved = call(base, f"{row}/move", {"env": "garden"}, key)
        assert moved.status == 200 and Todos(Record(record.root, "garden"), actor=SYSTEM).load(moved.body["n"]).title == "From the phone", \
            "a row moves to another environment of the same journal"
    finally:
        SERVING.pop(str(record.root.resolve()))
        desk.shutdown()


def test_a_disconnected_or_expired_phone_is_refused_on_its_next_tap(served):
    record, base = served
    n, key = paired(record, base)
    assert call(base, "/p/state", key=key)[0] == 200
    Phones(record, actor=USER).complete(n, how="lost it")
    assert call(base, "/p/state", key=key)[0] == 410, "a disconnect bites on the next request"
    later, other = paired(record, base, days=1)
    Controller.update(Phones(record, actor=SYSTEM), later, expires=time.time() - 1)
    assert call(base, "/p/message", {"brief": "hi", "idempotency": "y"}, other)[0] == 410, "a connection that ran out is refused"
    made = Phones(record, actor=USER).connect(7)
    Controller.update(Phones(record, actor=SYSTEM), made["n"], code_until=time.time() - 1)
    assert call(base, "/p/pair", {"code": made["link"].split("#", 1)[1], "device": "x"})[0] == 410, "a code that ran out connects nothing"


def test_no_secret_is_kept_in_the_record(served):
    record, base = served
    made = Phones(record, actor=USER).connect(7)
    code = made["link"].split("#", 1)[1]
    _, _, cookie = call(base, "/p/pair", {"code": code, "device": "Pixel"})
    key = cookie.split(";", 1)[0].split("=", 1)[1]
    kept = "".join(f.read_text(errors="ignore") for f in record.root.rglob("*") if f.is_file())
    assert code not in kept and key not in kept, "only fingerprints of the code and the key are written down"


def test_only_the_user_connects_a_phone_and_nobody_sets_its_key(served, monkeypatch):
    record, _ = served
    with pytest.raises(Refused):
        Phones(record, actor=AGENT).connect(7)
    with pytest.raises(Refused):
        Phones(record, actor=USER).connect(365)
    with pytest.raises(Refused):
        Phones(record, actor=AGENT).create("my phone", key="abc")
    n = Phones(record, actor=USER).connect(7)["n"]
    with pytest.raises(Refused):
        Phones(record, actor=AGENT).update(n, key="abc", expires=time.time() + 999)
    from commands.dispatch import reached_by_phone
    from features.phone.allow_list import Reach
    from features.phone.members import MEMBER_RIGHTS, MemberRights
    sam = Phones(record, actor=USER).connect(7, "sam")["n"]
    assert (Phones(record, actor=SYSTEM)._phone(sam).member, Phones(record, actor=SYSTEM)._phone(n).member) == ("sam", OWNER_ID), \
        "a phone connected for a member is that member's, and the owner's stays the owner's"
    asked = lambda who: reached_by_phone(record.root, "GET", "/api/identity", {}, {}, record.env, True, who)
    assert (asked(OWNER_ID), asked("sam")) == (Reach.OPEN, Reach.CLOSED), "a member's phone reaches nothing until the member's rights grant it, and the owner's phone is as before"

    class Grants(MemberRights):
        def may_reach(self, record, member, page):
            return member == "sam" and page == allow_list.get("/api/identity")

        def sees(self, record, member, row):
            return member == "sam" and row.title.startswith("Sam")

    MEMBER_RIGHTS.add(None, lambda record: Grants())
    try:
        assert (asked("sam"), asked("kim")) == (Reach.OPEN, Reach.CLOSED), "and then reaches exactly what its member is granted"
        mine, theirs = Todos(record, actor=SYSTEM).create("Sam's"), Todos(record, actor=SYSTEM).create("Kim's")
        phone = Phones(record, actor=SYSTEM)._phone(sam)
        from features.phone.feed import reaches
        assert (reaches(record, phone, mine), reaches(record, phone, theirs)) == (True, False), "a member's phone is shown, and pushed, only what its member may see"
    finally:
        MEMBER_RIGHTS.remove(MEMBER_RIGHTS.entries[-1].value)
    unaddressed = fresh()
    with monkeypatch.context() as patched:
        patched.setattr(Shares, "_address", lambda self: "")
        with pytest.raises(Refused, match="tunnel address"):
            Phones(unaddressed, actor=USER).connect(7)
    assert Phones(unaddressed, actor=USER).rows.summaries() == [], "no code is made for a phone while there is no tunnel address"


def test_a_phone_speaks_and_reads_only_in_its_own_environment(served, monkeypatch):
    record, base = served
    other = Record(record.root, "elsewhere")
    mine, key = paired(record, base)
    call(base, "/p/message", {"brief": "Here only", "idempotency": "z"}, key)
    assert [m for m in Messages(record, actor=SYSTEM).rows.summaries() if m.get("idempotency") == "z"], "it lands where the phone connected"
    assert not [m for m in Messages(other, actor=SYSTEM).rows.summaries() if m.get("idempotency") == "z"], "and nowhere else"
    here, there = Docs(record, actor=AGENT).create("Here"), Docs(other, actor=AGENT).create("There")
    assert call(base, f"/p/row/doc/{here.n}", key=key).status == 200, "its own environment's document opens"
    assert call(base, f"/p/row/doc/{there.n}", key=key).status == 404, "another environment's stays closed"
    assert call(base, f"/p/row/phone/{mine}", key=key).status == 404, "a row that holds keys never opens, not even its own"
    (record.root.parent / "notes").mkdir(exist_ok=True)
    (record.root.parent / "notes" / "plan.md").write_text("line one\nline two\n")
    (record.root.parent / ".env").write_text("SECRET=1\n")
    (record.root.parent / "notes" / "credentials.json").write_text("{}")
    assert call(base, "/p/source?q=notes/plan.md", key=key).body["lines"] == 2
    from engine.project_files import walk
    walk(record.root.parent.resolve())
    assert call(base, "/p/source?q=plan.md", key=key).body["path"] == "notes/plan.md", "a bare file name finds the one file of that name"
    assert [call(base, f"/p/source?q={asked}", key=key).status for asked in (".env", ".journal/record.json", "../../etc/hosts", "notes/credentials.json")] == [404, 404, 404, 404], \
        "hidden files, the journal's own and anything outside the project stay closed"
    for suffix in ("p8", "ppk", "tfstate", "gpg", "asc"):
        (record.root.parent / "notes" / f"private.{suffix}").write_text("secret")
        assert call(base, f"/p/source?q=notes/private.{suffix}", key=key).status == 404
    journal = str(record.root.resolve())
    Controller.create(CONTROLLERS["environment"](record, actor=SYSTEM), "elsewhere", kind=EnvironmentKind.MAIN)
    assert "elsewhere" in next(p for p in call(base, "/p/places", key=key).body["places"] if p["root"] == journal)["environments"]
    assert call(base, "/p/switch", {"journal": "/somewhere/else/.journal", "environment": "main"}, key).status == 422, \
        "only a running journal on this machine can be switched to"
    assert call(base, "/p/switch", {"journal": journal, "environment": "elsewhere"}, key).status == 201
    assert call(base, f"/p/row/doc/{there.n}", key=key).status == 200, "after switching, the other environment's rows open"
    from features.starting_agents import launch
    launched = []
    monkeypatch.setattr(launch, "detached", lambda root, cwd, env, agent, args, conversation="": launched.append((env, agent)))
    assert call(base, "/p/start", {"journal": journal, "environment": "elsewhere", "agent": "codex"}, key).status == 201
    assert launched == [("elsewhere", "codex")], "the phone starts an agent in an idle environment, as the user"
    from engine.sessions import Sessions
    outside = subprocess.Popen(["sleep", "30"])
    try:
        Sessions(record.root).bind("busy", "elsewhere", pid=outside.pid, provider="claude")
        assert call(base, "/p/start", {"journal": journal, "environment": "elsewhere", "agent": "codex"}, key).status == 409, "an environment whose agent is at work is not started again"
        assert call(base, "/p/stop", {}, key).status == 201, "the phone ends the agent working in its environment"
        assert outside.wait(timeout=5) != 0, "and that agent is ended"
    finally:
        outside.kill()
        outside.wait(timeout=5)
        Sessions(record.root).unbind("busy")
    Todos(Record(record.root, "elsewhere"), actor=AGENT).create("Tidy the attic")
    listed = call(base, "/p/list?type=todo", key=key).body
    assert ([row["title"] for row in listed["rows"]], listed["total"]) == (["Tidy the attic"], 1), "a card knows how many rows there are in all"
    assert call(base, "/p/list?type=phone", key=key).status == 404, "the home screen lists only its card kinds"
    assert call(base, "/p/arrange", {"cards": ["todo", "waiting", "todo"]}, key).status == 201
    assert call(base, "/p/state", key=key).body["home"] == ["todo", "waiting"], "the chosen cards keep their order, once each"
    assert call(base, "/p/bar", key=key).body == {"queue": []}, "the agent's status line reaches the phone"
    waiting = [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]]
    assert f"doc:{here.n}" not in waiting and f"doc:{there.n}" not in waiting, "a document read on the phone no longer waits"


def test_a_question_is_answered_once_and_a_changed_plan_is_not_approved(served, monkeypatch):
    from features.phone import controller, feed, push
    record, base = served
    _, key = paired(record, base)
    assert call(base, "/p/push", {"endpoint": "https://example.com/steal"}, key).status == 422, "only a real push service is ever called"
    assert call(base, "/p/push", {"endpoint": "https://web.push.apple.com/abc"}, key).status == 201
    pushed = []
    monkeypatch.setattr(controller, "send", lambda keys, endpoint, contact: pushed.append(keys.token(endpoint, contact, time.time())) or True)
    question = Questions(record, actor=AGENT).create("Go ahead?")
    Phones(record, actor=SYSTEM)._notify()
    Phones(record, actor=SYSTEM)._notify()
    head, claims, signature = pushed[0].split(".")
    public = push.Keys.kept(record.root).public
    assert len(pushed) == 1 and push.verified(public, f"{head}.{claims}".encode(), push.base64.urlsafe_b64decode(signature + "==")), \
        "a new question sends one signed push, and not again while it waits"
    import io
    keys, apple = push.Keys.kept(record.root), "https://web.push.apple.com/abc"
    sent = []
    class Pushed(io.BytesIO):
        status = 201
    monkeypatch.setattr(push.urllib.request, "urlopen", lambda request, timeout: sent.append(request) or Pushed())
    assert (push.send(keys, apple, "mailto:me@example.com"), push.send(keys, "https://example.com/steal", "mailto:me@example.com")) == (True, False), \
        "a push goes only to a real push service"
    assert len(sent) == 1 and sent[0].headers["Urgency"] == "high" and sent[0].headers["Authorization"].startswith("vapid t="), "and carries its signed token"
    monkeypatch.setattr(push.urllib.request, "urlopen", lambda request, timeout: (_ for _ in ()).throw(OSError("offline")))
    assert push.send(keys, apple, "mailto:me@example.com") is False, "a push service that cannot be reached is a push not sent, never an error"
    assert [push.allowed(url) for url in ("http://web.push.apple.com/x", "https://x.notify.windows.com/y", "https://evil.example/")] == [False, True, False], \
        "only https endpoints of the known push services are called"
    from types import SimpleNamespace
    from features.phone import places as phone_places
    other = record.root.parent / "elsewhere" / ".journal"
    (other / "environments").mkdir(parents=True)
    monkeypatch.setattr(phone_places, "known", lambda: [SimpleNamespace(root=str(other))])
    assert [place.root for place in phone_places.places(record.root)] == [str(record.root.resolve())], "a journal kept in a temporary folder is not offered to the phone"
    monkeypatch.setattr(phone_places, "TEMPORARY", ())
    assert [place.root for place in phone_places.places(record.root)] == [str(record.root.resolve()), str(other.resolve())], "any other journal on the machine is"
    assert phone_places.running(other) is False, "one with no running server says so"
    assert [row["state"] for row in feed.subagents_of(record, [{"running": True}, {"refusal": "not allowed"}, {"status": "stopped"}, {}])] == \
        ["working", "refused", "stopped", "finished"], "a subagent is working while it runs and otherwise refused, stopped or finished"
    monkeypatch.setattr(Shares, "_address", lambda self: "")
    Questions(record, actor=AGENT).create("Another one?")
    Phones(record, actor=SYSTEM)._notify()
    assert len(pushed) == 1, "with no tunnel address a push has nowhere to point, so none is sent"
    monkeypatch.undo()
    monkeypatch.setattr(controller, "send", lambda keys, endpoint, contact: pushed.append(keys.token(endpoint, contact, time.time())) or True)
    assert f"question:{question.n}" in [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]], "an open question waits"
    asked = next(item for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == f"question:{question.n}")
    assert asked["hold"] == 3, "the phone holds a picked answer as long as the desktop does, from the same setting"
    assert call(base, "/p/answer", {"n": question.n, "answer": "Yes"}, key).status == 201
    answered = Questions(record, actor=SYSTEM).load(question.n)
    assert answered.outcome == "Yes" and answered.data["answered_by"] == USER, "the answer is the user's"
    assert call(base, "/p/answer", {"n": question.n, "answer": "No"}, key).status == 409, "a second tap finds it answered"
    unwanted = Questions(record, actor=AGENT).create("Rename the repo?")
    assert call(base, "/p/dismiss", {"n": unwanted.n}, key).status == 201 and Questions(record, actor=SYSTEM).load(unwanted.n).data["dismissed"], \
        "a question can be dismissed from the phone"
    assert call(base, "/p/dismiss", {"n": unwanted.n}, key).status == 409, "a question already dismissed is not dismissed again"
    assert call(base, "/p/answer", {"n": Questions(record, actor=AGENT).create("Which one?", options=[{"title": "A"}, {"title": "B"}], pick=1).n, "answer": " "}, key).status == 422, "an answer needs words"
    assert [call(base, f"/p/{name}", body, key).status for name, body in (("message", {"brief": " "}), ("react", {"n": 1, "face": "👍", "type": "doc"}),
                                                                     ("comment", {"ref": "doc:9999", "text": "hm"}))] == [422, 422, 422], \
        "a message without words, a reaction to what the phone cannot react to and a comment on a row it cannot read are all refused"
    plans = CONTROLLERS["plan"]
    plan = Controller.update(plans(record, actor=SYSTEM), plans(record, actor=AGENT).create("Ship it").n, status="ready")
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated - 5}, key).status == 409, "a plan that changed is not approved"
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated}, key).status == 201
    assert plans(record, actor=SYSTEM).load(plan.n).status == "approved"
    held = plans(record, actor=AGENT).create("Hold it")
    for title in ("One", "Two"):
        plans(record, actor=AGENT).phase(held.n, title, "done", checkpoint=title == "One")
    Controller.update(plans(record, actor=SYSTEM), held.n, status="waiting", current=1)
    beside = Controller.update(plans(record, actor=SYSTEM), plans(record, actor=AGENT).create("Beside it").n, status="active", delegated=True)
    strips = call(base, "/p/feed", key=key).body["plans"]
    assert [(each["n"], each["delegated"]) for each in strips] == [(held.n, False), (beside.n, True)], \
        "the feed carries a strip for each running plan, the one you work first and a delegated one after it"
    strip = strips[0]
    assert (strip["n"], strip["status"], [phase["title"] for phase in strip["phases"]]) == (held.n, "waiting", ["One", "Two"]), \
        "the feed carries the plan that runs, with its phases"
    assert call(base, "/p/continue", {"n": held.n, "updated": strip["updated"] - 5}, key).status == 409, "a plan that moved on is not continued"
    assert call(base, "/p/continue", {"n": held.n, "updated": strip["updated"]}, key).status == 201
    assert call(base, "/p/permit", {"allow": True}, key).status == 422, "with no agent running there is no permission to answer"
    assert plans(record, actor=SYSTEM).load(held.n).current == 2, "Continue passes the checkpoint to the next phase"
    proposal = Docs(record, actor=AGENT).create("Proposal", buttons=[{"label": "Accept", "say": "I accept this proposal", "choice": "answer"},
                                                                     {"label": "Change it", "say": "I want changes", "choice": "answer"}])
    Docs(record, actor=USER).read(proposal.n)
    waiting = lambda: [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]]
    assert f"doc:{proposal.n}" in waiting(), "a read document still needs you while its buttons wait for an answer"
    assert call(base, "/p/press", {"ref": f"doc:{proposal.n}", "label": "Accept"}, key).status == 201
    assert f"doc:{proposal.n}" not in waiting(), "and leaves Needs you once its choice is made"
    assert call(base, "/p/comment", {"ref": f"doc:{proposal.n}", "text": "Looks right to me"}, key).status == 201
    shown = call(base, f"/p/row/doc/{proposal.n}", key=key).body["comments"]
    assert [c["brief"] for c in shown] == ["Looks right to me"] and shown[0]["who"] == USER, "a comment from the phone lands on the row, as on the desktop"
    urgent = Todos(record, actor=AGENT).create("Ship the fix")
    Todos(record, actor=AGENT).priority(urgent.n, "high")
    assert call(base, f"/p/row/todo/{urgent.n}", key=key).body["priority_name"] == "high", "a priority that is a named level reaches the phone by its name"
    pinned = Notices(record, actor=AGENT).create("The design is ready", link="https://example.com/design", label="Open the design")
    pins = lambda: [notice["n"] for notice in call(base, "/p/feed", key=key).body["notices"]]
    assert pinned.n in pins(), "the chat's pinned notices reach the phone"
    assert call(base, "/p/close", {"n": pinned.n}, key).status == 201 and pinned.n not in pins(), "and closing one there closes it everywhere"
    subagents = Notices(record, actor=AGENT).create("A subagent's own notice", agent="sub-1")
    assert call(base, "/p/close", {"n": subagents.n}, key).status == 422, "a notice that belongs to a subagent's chat is not the phone's to close"
    assert any(item["type"] == "comment" and item["brief"] == "Looks right to me" for item in call(base, "/p/feed", key=key).body["items"]), "a comment on a row shows in the phone's chat, as on the desktop"
    with urllib.request.urlopen(urllib.request.Request(f"{base}/p/export/doc/{proposal.n}", headers={"Cookie": f"__Host-phone={key}"}), timeout=30) as sent:
        assert "Proposal" in sent.headers["Content-Disposition"] and sent.read(), "a document leaves the phone as a file named for it"
    import shutil
    which = shutil.which
    shutil.which = lambda name, *more, **options: None if name == "textutil" else which(name, *more, **options)
    try:
        with urllib.request.urlopen(urllib.request.Request(f"{base}/p/export/doc/{proposal.n}", headers={"Cookie": f"__Host-phone={key}"}), timeout=30) as sent:
            assert (".html" in sent.headers["Content-Disposition"], sent.read().startswith(b"<")) == (True, True), "on a machine with no converter a document leaves the phone as a web page"
    finally:
        shutil.which = which
    shared = call(base, "/p/share", {"ref": f"doc:{proposal.n}"}, key)
    assert shared.status == 201 and "/s/" in shared.body["link"], "and as a share link the user made, open at once"
    said = [m for m in Messages(record, actor=SYSTEM).rows.summaries() if m["title"] == "I accept this proposal"]
    assert said and call(base, "/p/press", {"ref": f"doc:{proposal.n}", "label": "Change it"}, key).status == 409, \
        "a button pressed on the phone says its words, and the other button of the same choice is gone"
    now = time.time()
    CONTROLLERS["agent"](record, actor=SYSTEM).create(
        "codex-1",
        status="working",
        at=now,
        thoughts=[{"at": now, "text": "Weighing it"}],
        cards=[{"at": now, "label": "Agent committed abc1234", "icon": "commit"}],
        subagent_rows=[{"id": "sub-1", "session": "session-1", "task": "Check the phone feed", "type": "Explore", "model": "haiku",
                        "at": now, "running": True, "tool": "Read", "file": "src/features/phone/controller.py"}],
    )
    agent = CONTROLLERS["agent"](record, actor=SYSTEM)
    agent.card(agent.by_session("codex-1").n, key="command:gone", state="done", ended=now)
    assert all("label" in card for card in agent.by_session("codex-1").data["cards"]), "an update to a mark no longer kept is dropped, so every mark keeps its label"
    helper = Helpers(record, actor=SYSTEM).create("Split the phone view", name="Rhea", provider="codex", model="gpt-5-codex",
                                                  environment=f"{record.env}-rhea")
    from controllers.types import Environments
    Environments(record, actor=SYSTEM).create(helper.environment, owner=helper.ref, launched_from=record.env, kind=EnvironmentKind.HELPER)
    helper_record = Record(record.root, helper.environment)
    todo = Todos(helper_record, actor=SYSTEM).create(helper.title)
    CONTROLLERS["work"](helper_record, actor=SYSTEM).create(helper.title, todo=todo.n)
    CONTROLLERS["agent"](helper_record, actor=SYSTEM).create("codex-rhea", status="working", at=now, started=now - 60,
                                                             tool="Edit", file="src/web/src/phone/PhoneHome.vue")
    from overview.summary import summarize
    monkeypatch.setattr(feed, "lately_summarized", summarize)
    fed = call(base, "/p/feed", key=key).body
    assert fed["agent"] == "offline", "the phone sees no agent running"
    assert fed["build"].startswith("phone-") and fed["build"].endswith(".js"), "the phone learns which build of its app is installed"
    shown = [(item["type"], item.get("label", "")) for item in fed["items"]]
    assert ("thought", "Weighing it") in shown and any(kind == "card" and label.startswith("Agent committed") for kind, label in shown), \
        "the agent's thoughts and chat marks reach the phone"
    record.set_setting("viewer", {"chat_hidden": ["thoughts", "notes"]})
    kept = [(item["type"], item.get("label", "")) for item in call(base, "/p/feed", key=key).body["items"]]
    assert ("thought", "Weighing it") not in kept and not any(label.startswith("Agent committed") for _, label in kept), \
        "a kind hidden in the viewer's chat setting is left out of the phone's feed too"
    record.set_setting("viewer", {})
    assert call(base, "/p/stop", {}, key).status == 422 and call(base, "/p/pause", {}, key).status == 422, "with no agent running there is nothing to stop or pause"
    running = call(base, "/p/feed", key=key).body["running"]
    assert (running["state"], running["paused"], running["usage"]) == ("offline", False, []), "the phone sees the agent's state, pause, context and usage"
    assert running["helpers"][0]["state"] == "working" and running["helpers"][0]["todo"]["n"] == todo.n, \
        "the feed gives the phone a helper's state, current work and to-do"
    assert running["subagents"][0]["id"] == "sub-1" and running["subagents"][0]["state"] == "working", \
        "the feed gives the phone the current environment's subagents"
    detail = call(base, f"/p/helper?n={helper.n}", key=key)
    assert detail.status == 200 and detail.body["todo"]["title"] == helper.title and detail.body["running"], \
        "the phone can open a helper from the environment that launched it"
    from controllers.types import Agents
    from engine.sessions import Sessions
    Sessions(record.root).write("claude-4242", environment=record.env, pid=os.getpid(), since=time.time() - 60)
    assert Agents(record, actor=SYSTEM).state(record.env) == "silent", "an agent started a minute ago that never reported in is said to be silent, not idle or offline"
    CONTROLLERS["agent"](record, actor=SYSTEM).create("d2c1c997-real", event="PostToolUse", status="working")
    Sessions(record.root).write("d2c1c997-real", environment=record.env, pid=os.getpid(), since=time.time() - 30, seen=time.time())
    assert Agents(record, actor=SYSTEM).state(record.env) == "working", "an older launch record of the same agent never hides the session that reports"
    from engine import runtime
    from engine.stored import write_json
    write_json(runtime.session_file(record.root, "claude-4343", "seat.json"), {"at": time.time(), "agent": "claude", "env": record.env, "report": {"title": "claude-4343", "provider": "claude"}})
    Sessions(record.root).write("claude-4343", environment=record.env, pid=os.getpid(), since=time.time() - 30, seen=time.time())
    assert [call(base, f"/p/{tap}", {}, key).status for tap in ("pause", "resume")] == [201, 201], "with an agent running, the phone pauses it and resumes it"
    Sessions(record.root).write("claude-4343", environment="")
    Sessions(record.root).write("d2c1c997-real", environment="")
    from features.phone.places import shown
    Environments(record, actor=USER).create("ticket-4", owner="ticket:4", kind=EnvironmentKind.TICKET)
    assert {f"{record.env}-rhea", "ticket-4"}.isdisjoint(shown(record.root)), "a helper's or a ticket's own environment stays out of the phone's places"
    Sessions(record.root).write("claude-4242", environment="")
    assert call(base, "/p/auto", {"on": True}, key).status == 201 and call(base, "/p/feed", key=key).body["running"]["auto"] is True, \
        "the phone switches auto mode, the same setting the desktop's switch flips"
    assert call(base, "/p/helper/stop", {"n": 7}, key).status == 422, "stopping a helper that is not there is refused in words"
    assert call(base, "/p/mode", {"mode": "lazy"}, key).status == 422, "only the three work modes are taken"
    assert call(base, "/p/mode", {"mode": "solo"}, key).status == 201 and call(base, "/p/feed", key=key).body["running"]["mode"] == "solo", \
        "the phone picks the work mode the agent sheet shows"


def test_a_connected_phone_keeps_the_tunnel_wanted(served):
    record, base = served
    assert not wanted(record.root)
    paired(record, base)
    assert wanted(record.root), "the share server and tunnel stay up while a phone is connected"


def test_the_short_code_pairs_and_the_page_can_live_on_the_home_screen(served, monkeypatch):
    record, base = served
    assert Phones(record, actor=SYSTEM)._notify() is None, "with no phone connected there is nobody to push to"
    made = Phones(record, actor=USER).connect(7)
    assert len(made["short"]) == 9 and made["short"][4] == "-", "a short code reads as two groups of four"
    pairing = call(base, "/p/pair", {"code": made["short"].lower().replace("-", " "), "device": "iPhone"})
    assert pairing.status == 200, "typed loosely, it still pairs"
    manifest = urllib.request.urlopen(f"{base}/p/manifest.webmanifest", timeout=5)
    body = json.loads(manifest.read())
    assert (body["display"], body["start_url"]) == ("standalone", "/p/") and body["icons"], "it opens full screen from the home screen"
    with urllib.request.urlopen(f"{base}/p/icon-180.png", timeout=5) as got:
        assert got.read(8) == b"\x89PNG\r\n\x1a\n", "with an icon of its own"
    with urllib.request.urlopen(f"{base}/p/sw.js", timeout=5) as got:
        assert "connect-src 'self'" in got.headers["Content-Security-Policy"], "its worker may fetch the page, so a reload works offline and online"
    key = pairing.cookie.split(";", 1)[0].split("=", 1)[1]
    read = lambda path: call(base, path, key=key).status
    assert [read("/p/push-key"), read("/p/places"), read("/p/state"), read("/p/bar"), read("/p/feed")] == [200] * 5, "a connected phone reads its key, places, state, bar and feed"
    assert [read("/p/feed?before=soon"), read("/p/helper"), read("/p/helper?n=x"), read("/p/nothing"), read("/p/export/doc/9999"), read("/p/file/doc/9999/a.txt")] == \
        [400, 400, 400, 404, 404, 404], "a read that asks wrongly is told so, and one for a row or file the phone cannot reach finds nothing"
    assert [call(base, "/p/", key=key).status, call(base, "/p/nowhere/page", key=key).status] == [200, 404], "the page opens at its own address and nowhere else"
    assert (call(base, "/p", key=key).status, read("/p/a/b/c/d")) == (200, 404), "the page is also found without its closing slash, and a read that names too much finds nothing"
    from features.phone import routes as phone_routes
    monkeypatch.setattr(phone_routes, "APP_DIR", Path("/nonexistent/app"))
    assert (read("/p/feed"), call(base, "/p/", key=key).status, phone_routes.built()) == (200, 404, ""), "without the built page the phone still reads its feed and the page is not found"
    assert [call(base, path, {}, key=key).status for path in ("/p/", "/p/nothing/here")] == [404, 404], "a write to no action finds none"
    assert call(base, "/p/message", {"text": "x" * 20000}, key=key).status == 413, "a write too large to be a note is refused"
    from controllers.types import Docs, Notices
    note, task = Docs(record, actor=USER).create("A note", brief="words"), Notices(record, actor=SYSTEM).create("A notice")
    assert [call(base, "/p/comment", {"ref": note.ref, "text": " "}, key).status, call(base, "/p/comment", {"ref": task.ref, "text": "hm"}, key).status] == [422, 422], \
        "a comment on a row needs words, and a row that takes no comments takes none from the phone"
    assert [call(base, "/p/auto", {"on": flag}, key).status for flag in (False, True)] == [201, 201], "the phone switches auto mode on and off"
    assert [call(base, "/p/arrange", {"cards": ["nothing"]}, key).status, call(base, "/p/switch", {"journal": "/nowhere", "environment": "x"}, key).status,
            call(base, "/p/start", {"journal": "/nowhere", "environment": "x"}, key).status, call(base, "/p/push", {"endpoint": "http://example.com"}, key).status] == [422] * 4, \
        "a phone cannot arrange cards that do not exist, switch to or start an environment it cannot find, or subscribe to a push service it does not trust"
