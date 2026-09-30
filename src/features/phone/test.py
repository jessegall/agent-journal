import json
import threading
import time
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from typing import NamedTuple

import pytest

from controllers.base import Controller
from controllers.types import CONTROLLERS, Docs, Messages, Notices, Questions, Todos
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
            body = json.loads(got.read()) if got.headers.get_content_type() == "application/json" else {}
            return Answer(got.status, body, got.headers.get("Set-Cookie", ""))
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
    assert len([m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "a1"]) == 1, "a resend is one message"
    upload = lambda n, kind="application/octet-stream": urllib.request.urlopen(urllib.request.Request(
        f"{base}/p/attach/{n}/photo.jpg", b"\xff\xd8picture", {"Origin": base, "X-Phone": "1", "Content-Type": kind, "Cookie": f"__Host-phone={key}"},
        method="POST"), timeout=5).status
    assert upload(made["n"]) == 201 and "photo.jpg" in Messages(record, actor=SYSTEM).load(made["n"]).files, "a photo goes onto the phone's message"
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


def test_a_phone_speaks_and_reads_only_in_its_own_environment(served, monkeypatch):
    record, base = served
    other = Record(record.root, "elsewhere")
    mine, key = paired(record, base)
    call(base, "/p/message", {"brief": "Here only", "idempotency": "z"}, key)
    assert [m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "z"], "it lands where the phone connected"
    assert not [m for m in Messages(other, actor=SYSTEM).summaries() if m.get("idempotency") == "z"], "and nowhere else"
    here, there = Docs(record, actor=AGENT).create("Here"), Docs(other, actor=AGENT).create("There")
    assert call(base, f"/p/row/doc/{here.n}", key=key).status == 200, "its own environment's document opens"
    assert call(base, f"/p/row/doc/{there.n}", key=key).status == 404, "another environment's stays closed"
    assert call(base, f"/p/row/phone/{mine}", key=key).status == 404, "a row that holds keys never opens, not even its own"
    (record.root.parent / "notes").mkdir(exist_ok=True)
    (record.root.parent / "notes" / "plan.md").write_text("line one\nline two\n")
    (record.root.parent / ".env").write_text("SECRET=1\n")
    assert call(base, "/p/source?q=notes/plan.md", key=key).body["lines"] == 2
    assert call(base, "/p/source?q=plan.md", key=key).body["path"] == "notes/plan.md", "a bare file name finds the one file of that name"
    assert [call(base, f"/p/source?q={asked}", key=key).status for asked in (".env", ".journal/record.json", "../../etc/hosts")] == [404, 404, 404], \
        "hidden files, the journal's own and anything outside the project stay closed"
    journal = str(record.root.resolve())
    Controller.create(CONTROLLERS["environment"](record, actor=SYSTEM), "elsewhere")
    assert "elsewhere" in next(p for p in call(base, "/p/places", key=key).body["places"] if p["root"] == journal)["environments"]
    assert call(base, "/p/switch", {"journal": "/somewhere/else/.journal", "environment": "main"}, key).status == 422, \
        "only a running journal on this machine can be switched to"
    assert call(base, "/p/switch", {"journal": journal, "environment": "elsewhere"}, key).status == 201
    assert call(base, f"/p/row/doc/{there.n}", key=key).status == 200, "after switching, the other environment's rows open"
    from features.starting_agents import commands
    launched = []
    monkeypatch.setattr(commands, "detached", lambda root, cwd, env, agent, args: launched.append((env, agent)))
    assert call(base, "/p/start", {"journal": journal, "environment": "elsewhere", "agent": "codex"}, key).status == 201
    assert launched == [("elsewhere", "codex")], "the phone starts an agent in an idle environment, as the user"
    Todos(Record(record.root, "elsewhere"), actor=AGENT).create("Tidy the attic")
    assert [row["title"] for row in call(base, "/p/list?type=todo", key=key).body["rows"]] == ["Tidy the attic"]
    assert call(base, "/p/list?type=phone", key=key).status == 404, "the home screen lists only its card kinds"
    assert call(base, "/p/arrange", {"cards": ["todo", "waiting", "todo"]}, key).status == 201
    assert call(base, "/p/state", key=key).body["home"] == ["todo", "waiting"], "the chosen cards keep their order, once each"
    assert call(base, "/p/bar", key=key).body == {"queue": []}, "the agent's status line reaches the phone"
    waiting = [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]]
    assert f"doc:{here.n}" not in waiting and f"doc:{there.n}" not in waiting, "a document read on the phone no longer waits"


def test_a_question_is_answered_once_and_a_changed_plan_is_not_approved(served, monkeypatch):
    from features.phone import controller, push
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
    assert f"question:{question.n}" in [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]], "an open question waits"
    assert call(base, "/p/answer", {"n": question.n, "answer": "Yes"}, key).status == 201
    answered = Questions(record, actor=SYSTEM).load(question.n)
    assert answered.outcome == "Yes" and answered.data["answered_by"] == USER, "the answer is the user's"
    assert call(base, "/p/answer", {"n": question.n, "answer": "No"}, key).status == 409, "a second tap finds it answered"
    unwanted = Questions(record, actor=AGENT).create("Rename the repo?")
    assert call(base, "/p/dismiss", {"n": unwanted.n}, key).status == 201 and Questions(record, actor=SYSTEM).load(unwanted.n).data["dismissed"], \
        "a question can be dismissed from the phone"
    plans = CONTROLLERS["plan"]
    plan = Controller.update(plans(record, actor=SYSTEM), plans(record, actor=AGENT).create("Ship it").n, status="ready")
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated - 5}, key).status == 409, "a plan that changed is not approved"
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated}, key).status == 201
    assert plans(record, actor=SYSTEM).load(plan.n).status == "approved"
    proposal = Docs(record, actor=AGENT).create("Proposal", buttons=[{"label": "Accept", "say": "I accept this proposal", "choice": "answer"},
                                                                     {"label": "Change it", "say": "I want changes", "choice": "answer"}])
    Docs(record, actor=USER).read(proposal.n)
    waiting = lambda: [item["ref"] for item in call(base, "/p/feed", key=key).body["waiting"]]
    assert f"doc:{proposal.n}" in waiting(), "a read document still needs you while its buttons wait for an answer"
    assert call(base, "/p/press", {"ref": f"doc:{proposal.n}", "label": "Accept"}, key).status == 201
    assert f"doc:{proposal.n}" not in waiting(), "and leaves Needs you once its choice is made"
    said = [m for m in Messages(record, actor=SYSTEM).summaries() if m["title"] == "I accept this proposal"]
    assert said and call(base, "/p/press", {"ref": f"doc:{proposal.n}", "label": "Change it"}, key).status == 409, \
        "a button pressed on the phone says its words, and the other button of the same choice is gone"
    fed = call(base, "/p/feed", key=key).body
    assert fed["agent"] == "offline", "the phone sees no agent running"
    assert fed["build"].startswith("phone-") and fed["build"].endswith(".js"), "the phone learns which build of its app is installed"
    now = time.time()
    CONTROLLERS["agent"](record, actor=SYSTEM).create("codex-1", thoughts=[{"at": now, "text": "Weighing it"}],
                                                       cards=[{"at": now, "label": "Agent committed abc1234", "icon": "commit"}])
    shown = {item["type"]: item.get("label") for item in call(base, "/p/feed", key=key).body["items"] if item["type"] in ("thought", "card")}
    assert shown.get("thought") == "Weighing it" and shown.get("card", "").startswith("Agent committed"), "the agent's thoughts and chat marks reach the phone"
    assert call(base, "/p/stop", {}, key).status == 404, "the phone cannot stop the agent; that stays on the computer"


def test_a_connected_phone_keeps_the_tunnel_wanted(served):
    record, base = served
    assert not wanted(record.root)
    paired(record, base)
    assert wanted(record.root), "the share server and tunnel stay up while a phone is connected"


def test_the_short_code_pairs_and_the_page_can_live_on_the_home_screen(served):
    record, base = served
    made = Phones(record, actor=USER).connect(7)
    assert len(made["short"]) == 9 and made["short"][4] == "-", "a short code reads as two groups of four"
    assert call(base, "/p/pair", {"code": made["short"].lower().replace("-", " "), "device": "iPhone"}).status == 200, "typed loosely, it still pairs"
    manifest = urllib.request.urlopen(f"{base}/p/manifest.webmanifest", timeout=5)
    body = json.loads(manifest.read())
    assert (body["display"], body["start_url"]) == ("standalone", "/p/") and body["icons"], "it opens full screen from the home screen"
    with urllib.request.urlopen(f"{base}/p/icon-180.png", timeout=5) as got:
        assert got.read(8) == b"\x89PNG\r\n\x1a\n", "with an icon of its own"
