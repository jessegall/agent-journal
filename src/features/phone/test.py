import json
import threading
import time
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from typing import NamedTuple

import pytest

from controllers.base import Controller
from controllers.types import Messages, Notices
from engine.record import Record
from features.phone.controller import Phones
from features.sharing.controller import Shares
from features.sharing.server import ShareHandler
from features.sharing.services import wanted
from resources.base import AGENT, SYSTEM, USER, Refused
from tests.conftest import fresh


@pytest.fixture
def served():
    import features
    features.load()
    record = fresh()
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
            return Answer(got.status, json.loads(got.read() or b"{}"), got.headers.get("Set-Cookie", ""))
    except urllib.error.HTTPError as error:
        return Answer(error.code, {}, "")


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
    made = Phones(record, actor=USER).connect(7)
    code = made["link"].split("#", 1)[1]
    assert made["link"].startswith("https://") and "/p/#" in made["link"], "the code rides in the fragment, which never reaches a server"
    call(base, "/p/", method="HEAD")
    call(base, "/p/")
    assert call(base, "/p/pair", {"code": code, "device": "Pixel"})[0] == 200, "looking at the page first does not use the code up"
    assert call(base, "/p/pair", {"code": code, "device": "Other"})[0] == 410, "a code connects one phone, once"
    assert any("A phone connected" in row["title"] for row in Notices(record, actor=SYSTEM).summaries()), "a new phone is announced in the chat"


def test_a_message_from_the_phone_is_the_users_own(served):
    record, base = served
    n, key = paired(record, base)
    status, made, _ = call(base, "/p/message", {"brief": "Carry on with the tests", "idempotency": "a1"}, key)
    assert status == 201, status
    call(base, "/p/message", {"brief": "Carry on with the tests", "idempotency": "a1"}, key)
    message = Messages(record, actor=SYSTEM).load(made["n"])
    assert message.seen[:1] == [USER] and message.data["via"] == f"phone:{n}", "it is recorded as the user, naming the phone"
    assert len([m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "a1"]) == 1, "a resend is one message"


def test_a_write_from_anywhere_but_the_phone_page_is_refused(served):
    record, base = served
    _, key = paired(record, base)
    words = {"brief": "Delete everything", "idempotency": "x"}
    assert call(base, "/p/message", words, key, Origin="https://evil.example")[0] == 403, "another site cannot make the phone act"
    assert call(base, "/p/message", words, key, **{"X-Phone": ""})[0] == 403, "a write needs the phone page's header"
    assert call(base, "/p/message", words, key, **{"Content-Type": "text/plain"})[0] == 403, "a form post is refused"
    assert call(base, "/p/message", words, "not-a-key")[0] == 401, "a guessed key opens nothing"
    assert not [m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "x"]


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


def test_only_the_user_connects_a_phone_and_nobody_sets_its_key(served):
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


def test_a_phone_speaks_only_in_its_own_environment(served):
    record, base = served
    other = Record(record.root, "elsewhere")
    _, key = paired(record, base)
    call(base, "/p/message", {"brief": "Here only", "idempotency": "z"}, key)
    assert [m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "z"], "it lands where the phone connected"
    assert not [m for m in Messages(other, actor=SYSTEM).summaries() if m.get("idempotency") == "z"], "and nowhere else"


def test_a_connected_phone_keeps_the_tunnel_wanted(served):
    record, base = served
    assert not wanted(record.root)
    paired(record, base)
    assert wanted(record.root), "the share server and tunnel stay up while a phone is connected"
