import json
import os
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import NamedTuple

import pytest

from controllers.base import Controller
from controllers.types import CONTROLLERS, Comments, Docs, Messages, Notices, Questions, Todos
from engine.record import Record
from features.phone.controller import Phones
from features.phone.feed import POSTED
from features.helpers.controller import Helpers
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
    guessed = Phones(record, actor=USER).connect(7)
    for _ in range(10):
        call(base, "/p/pair", {"code": "wrong-guess", "device": "Pixel"})
    assert call(base, "/p/pair", {"code": guessed["link"].split("#", 1)[1], "device": "Pixel"})[0] == 410, \
        "ten wrong codes cancel the code that was waiting"
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
    script = Path(__file__).resolve().parents[2] / "journal.py"
    subprocess.run([sys.executable, str(script), "--root", str(record.root), "--env", record.env, "--as", AGENT, "message", "read", str(made["n"])],
                   capture_output=True, timeout=60, check=True)
    ticked = [item for item in call(base, "/p/feed", key=key).body["items"] if item["ref"] == f"message:{made['n']}"]
    assert ticked and "agent" in ticked[0]["seen"], "a read made in another process shows on the phone's next poll, so its ticks change"
    assert len([m for m in Messages(record, actor=SYSTEM).summaries() if m.get("idempotency") == "a1"]) == 1, "a resend is one message"
    nods = {Messages(record, actor=AGENT).create(f"Noted {i}.", brief=f"Noted {i}.", acknowledgement=True).ref for i in range(45)}
    refs = {item["ref"] for item in call(base, "/p/feed", key=key).body["items"]}
    assert (f"message:{made['n']}" in refs, refs & nods) == (True, set()), \
        "hidden acknowledgements are left out before the feed counts its page, so they never push a real message out"
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
              "question": lambda: Questions(record, actor=AGENT).create("Which port should it use"),
              "comment": lambda: Comments(record, actor=AGENT).create("noted on the message", refs=[f"message:{made['n']}"])}
    assert set(spoken) == set(POSTED), "every kind the phone's chat speaks is checked below"
    for kind, make in spoken.items():
        row = make()
        fed = {item["ref"] for item in call(base, "/p/feed", key=key).body["items"]}
        assert row.ref in fed, f"a {kind} the agent writes reaches the phone's chat"


def test_a_write_from_anywhere_but_the_phone_page_is_refused(served):
    record, base = served
    _, key = paired(record, base)
    words = {"brief": "Delete everything", "idempotency": "x"}
    assert call(base, "/p/message", words, key, Origin="https://evil.example")[0] == 403, "another site cannot make the phone act"
    assert call(base, "/p/message", words, key, **{"X-Phone": ""})[0] == 403, "a write needs the phone page's header"
    assert call(base, "/p/message", words, key, **{"Content-Type": "text/plain"})[0] == 403, "a form post is refused"
    assert call(base, "/p/message", words, "not-a-key")[0] == 401, "a guessed key opens nothing"
    assert call(base, "/p/", {}, key)[0] == 404, "a phone post without an action has no route"
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
    (record.root.parent / "notes" / "credentials.json").write_text("{}")
    assert call(base, "/p/source?q=notes/plan.md", key=key).body["lines"] == 2
    assert call(base, "/p/source?q=plan.md", key=key).body["path"] == "notes/plan.md", "a bare file name finds the one file of that name"
    assert [call(base, f"/p/source?q={asked}", key=key).status for asked in (".env", ".journal/record.json", "../../etc/hosts", "notes/credentials.json")] == [404, 404, 404, 404], \
        "hidden files, the journal's own and anything outside the project stay closed"
    for suffix in ("p8", "ppk", "tfstate", "gpg", "asc"):
        (record.root.parent / "notes" / f"private.{suffix}").write_text("secret")
        assert call(base, f"/p/source?q=notes/private.{suffix}", key=key).status == 404
    journal = str(record.root.resolve())
    Controller.create(CONTROLLERS["environment"](record, actor=SYSTEM), "elsewhere")
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
    plans = CONTROLLERS["plan"]
    plan = Controller.update(plans(record, actor=SYSTEM), plans(record, actor=AGENT).create("Ship it").n, status="ready")
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated - 5}, key).status == 409, "a plan that changed is not approved"
    assert call(base, "/p/approve", {"n": plan.n, "updated": plan.updated}, key).status == 201
    assert plans(record, actor=SYSTEM).load(plan.n).status == "approved"
    held = plans(record, actor=AGENT).create("Hold it")
    for title in ("One", "Two"):
        plans(record, actor=AGENT).phase(held.n, title, "done", checkpoint=title == "One")
    Controller.update(plans(record, actor=SYSTEM), held.n, status="waiting", current=1)
    strip = call(base, "/p/feed", key=key).body["plan"]
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
    assert any(item["type"] == "comment" and item["brief"] == "Looks right to me" for item in call(base, "/p/feed", key=key).body["items"]), "a comment on a row shows in the phone's chat, as on the desktop"
    with urllib.request.urlopen(urllib.request.Request(f"{base}/p/export/doc/{proposal.n}", headers={"Cookie": f"__Host-phone={key}"}), timeout=30) as sent:
        assert "Proposal" in sent.headers["Content-Disposition"] and sent.read(), "a document leaves the phone as a file named for it"
    shared = call(base, "/p/share", {"ref": f"doc:{proposal.n}"}, key)
    assert shared.status == 201 and "/s/" in shared.body["link"], "and as a share link the user made, open at once"
    said = [m for m in Messages(record, actor=SYSTEM).summaries() if m["title"] == "I accept this proposal"]
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
    Environments(record, actor=SYSTEM).create(helper.environment, owner=helper.ref, launched_from=record.env)
    helper_record = Record(record.root, helper.environment)
    todo = Todos(helper_record, actor=SYSTEM).create(helper.title)
    CONTROLLERS["work"](helper_record, actor=SYSTEM).create(helper.title, todo=todo.n)
    CONTROLLERS["agent"](helper_record, actor=SYSTEM).create("codex-rhea", status="working", at=now, started=now - 60,
                                                             tool="Edit", file="src/web/src/phone/PhoneHome.vue")
    from surfaces.summary import summarize
    monkeypatch.setattr(feed, "lately_summarized", summarize)
    fed = call(base, "/p/feed", key=key).body
    assert fed["agent"] == "offline", "the phone sees no agent running"
    assert fed["build"].startswith("phone-") and fed["build"].endswith(".js"), "the phone learns which build of its app is installed"
    shown = [(item["type"], item.get("label", "")) for item in fed["items"]]
    assert ("thought", "Weighing it") in shown and any(kind == "card" and label.startswith("Agent committed") for kind, label in shown), \
        "the agent's thoughts and chat marks reach the phone"
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
    Sessions(record.root).write("d2c1c997-real", environment="")
    from features.phone.places import shown
    Environments(record, actor=USER).create("ticket-4", owner="ticket:4")
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
    with urllib.request.urlopen(f"{base}/p/sw.js", timeout=5) as got:
        assert "connect-src 'self'" in got.headers["Content-Security-Policy"], "its worker may fetch the page, so a reload works offline and online"
