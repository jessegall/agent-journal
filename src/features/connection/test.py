import http.server
import socket
import subprocess
import threading
import time

import features
from controllers.features import Features
from controllers.types import Environments, Notices, Rules, Todos
from engine.machines import Lease, this_machine
from controllers.requests import request
from engine.offline import Applied, Sent, Waiting, Write
from engine.outbox import Outbox, Request
from engine.record import Record
from engine.sync import PROTOCOL, Comparison, Hello, Release, Shape, Step
from engine.version import version
from features.connection.code import Pushed, pull, push
from features.connection.linking import Synced, hand, join, local_hello, sync
from features.connection.transport import HttpTransport, ServerKey
from migrations import applied
from resources.base import AGENT, PROJECT, SYSTEM, USER, Event
from tests.conftest import fresh, hosted_world, refused  # noqa: F401


def asked(title: str) -> Request:
    return Request("", "todo", "create", [title])


class Server:
    """A stand-in for the journal on a server: it answers as told and keeps what it was sent."""

    def __init__(self, root, epoch=0, up=True):
        self.said = Hello(version(), Shape(PROTOCOL, frozenset(applied(root)), epoch), "server-1")
        self.up, self.handed, self.taken, self.events_to_give = up, [], [], []
        self.leases, self.loses_answers, self.loses_handovers = {}, False, False

    def hello(self):
        if not self.up:
            raise OSError("the server does not answer")
        return self.said

    def handover(self, env, lease):
        if not self.up:
            raise OSError("the server does not answer")
        if self.loses_handovers:
            raise TimeoutError("lost before the server took it")
        self.handed.append((env, lease))
        self.leases[env] = lease
        self.answer()

    def handback(self, env):
        if self.leases[env].machine != this_machine():
            self.leases[env] = self.leases[env].handed_to(this_machine())
        self.answer()
        return self.leases[env]

    def holder(self, env):
        return self.leases[env]

    def answer(self):
        if self.loses_answers:
            raise TimeoutError("the answer was lost on the way back")

    def send(self, held):
        if held.asked.args[0] == "turned down":
            return Sent.REFUSED
        self.taken.append(held.asked.args[0])
        return Sent.TAKEN if self.up else Sent.AWAY

    def events(self, scope, env, since):
        return [e for e in self.events_to_give if e.id > since]


def test_connecting_checks_the_server_and_keeps_what_it_found_and_a_server_that_does_not_answer_becomes_a_notice(monkeypatch):
    features.load()
    record = fresh()
    assert join(record, Server(record.root)).release is Release.SAME and record.state("connection").get("welcome")["step"] == Step.IN_STEP.value, \
        "a server on the same release and record shape is joined as it is"
    assert join(record, Server(record.root, epoch=5)).comparison == Comparison(Step.PULL_AGAIN), "a server in another epoch, such as after a restore, makes this copy pull everything again"
    assert local_hello(record).machine == this_machine(), "the check names this machine"
    newer = Server(record.root)
    newer.said = Hello("99.0.0", Shape(PROTOCOL, newer.said.shape.migrations | {"m9999_new"}, 0), "server-1", 99)
    assert "too old" in refused(lambda: join(record, newer)), "a server can ask for a newer copy than this one, and this one is told it is too old"
    newer.said = Hello("99.0.0", Shape(PROTOCOL, newer.said.shape.migrations, 0), "server-1")
    join(record, newer)
    assert any("not in step" in n.title for n in Notices(record, actor=SYSTEM).all()), "a server on a newer release leaves a notice that this copy is not in step with it"
    from features.connection.linking import leave, view, what_travels
    (record.root / "runtime").mkdir(exist_ok=True)
    (record.root / "runtime" / "live").write_text("never travels")
    travelled = what_travels(record.root)
    assert travelled.files > 0 and travelled.bytes > 0 and view(record, "https://server.example").travels == travelled, \
        "the viewer is told what connecting would send before it sends it, and live state is not counted"
    join(record, Server(record.root))
    assert (view(record, "https://server.example").connected, view(record, "https://server.example").step) == (True, "in step"), "a copy that has joined is shown as connected and how it stands"
    leave(record)
    assert (view(record, "").connected, record.setting("connection", {}).get("address")) == (False, ""), "disconnecting forgets the address and what was learned of the server"
    monkeypatch.setattr("features.connection.commands.transport_for", lambda record, address: Server(record.root))
    Features(record, actor=USER).switch("connection", True)
    Environments(record, actor=USER).action("connect")("https://server.example", "the-machine-key")
    kept = ServerKey(record.root)
    shown = str(Environments(record, actor=USER).action("connection")())
    assert (kept.read(), kept.file.stat().st_mode & 0o777, view(record, "https://server.example").has_key, "the-machine-key" in shown) == ("the-machine-key", 0o600, True, False), \
        "the machine key given in the viewer is saved on this computer alone, readable by its owner only, and never shown again"
    assert "the-machine-key" not in "".join(path.read_text(errors="ignore") for path in record.root.rglob("*") if path.is_file() and path != kept.file), \
        "and no other file of the record holds it"
    leave(record)
    join(record, newer)
    marked = view(record, "https://server.example")
    assert (marked.role, marked.synced_at) == ("your copy", 0.0), "a copy that has joined says it is a copy, and that it has not synced yet"
    record.hand_over("", "server-1")
    sync(record, Server(record.root))
    assert view(record, "https://server.example").synced_at > 0, "and after a sync it says when"
    record.hand_over("", this_machine())
    monkeypatch.setenv("JOURNAL_ADDRESS", "journal.example.com")
    assert view(record, "").role == "the server", "a journal that runs on a server says that it is the server"
    monkeypatch.setattr("features.connection.feature.transport_for", lambda record, address: Server(record.root, up=False))
    record.change_setting("connection", {"address": "https://server.example"})
    features.FEATURES["connection"].settings_changed(record, USER)
    assert any("Could not connect" in n.title for n in Notices(record, actor=SYSTEM).all()), "an address nobody answers at becomes a notice, not an error"
    Features(record, actor=USER).switch("connection", True)
    agent = Environments(record, actor=AGENT)
    tries = {"connect": lambda: agent.action("connect")("https://elsewhere.example"), "hand": lambda: agent.action("hand")(record.env, "server"),
             "disconnect": lambda: agent.action("disconnect")(), "code_push": lambda: agent.action("code_push")()}
    assert {word: "only the user" in refused(attempt) for word, attempt in tries.items()} == dict.fromkeys(tries, True), \
        "an agent can neither point the record's sync at another address, hand an environment over, disconnect nor push code"
    assert record.setting("connection", {}).get("address") == "https://server.example", "and the address the user set stays"


def test_an_environment_goes_to_the_server_only_once_it_has_taken_the_new_epoch_and_comes_back_through_the_same_lease():
    record = fresh()
    down = Server(record.root, up=False)
    assert "does not answer" in refused(lambda: hand(record.root, record.env, "server", down)) and record.holds(""), \
        "a server that does not answer takes nothing and this machine keeps the environment"
    Waiting(record.root).hold("", asked("waits"))
    assert "still wait" in refused(lambda: hand(record.root, record.env, "server", Server(record.root))) and record.holds(""), "writes still waiting go first"
    Waiting(record.root).flush(lambda held: Sent.TAKEN)
    Outbox(record.root).send(asked("for another holder"))
    assert "still wait" in refused(lambda: hand(record.root, record.env, "server", Server(record.root))), "and so do requests waiting for another scope's holder"
    Outbox(record.root).take(lambda waiting: True)
    server = Server(record.root)
    lease = hand(record.root, record.env, "server", server)
    assert (lease, server.handed, record.holds("")) == (Lease("server-1", 1), [(record.env, Lease("server-1", 1))], False), \
        "the server is told the new lease and this machine lets the environment go"
    back = hand(record.root, record.env, "here", server)
    assert (back, Record(record.root, record.env).holds("")) == (Lease(this_machine(), 2), True), "handing it back takes the lease the server made, once"
    assert "server or to here" in refused(lambda: hand(record.root, record.env, "mars", server)), "an environment goes to the server or comes here, nowhere else"
    server.loses_answers = True
    lease = hand(record.root, record.env, "server", server)
    assert (lease, server.leases[record.env], Record(record.root, record.env).holds("")) == (Lease("server-1", 3), Lease("server-1", 3), False), \
        "a handover whose answer is lost is settled by asking the server who holds the environment, so exactly one machine writes it"
    back = hand(record.root, record.env, "here", server)
    assert (back, server.leases[record.env], Record(record.root, record.env).holds("")) == (Lease(this_machine(), 4), Lease(this_machine(), 4), True), \
        "and so is a handback whose answer is lost"
    server.loses_answers, server.loses_handovers = False, True
    assert "run hand again" in refused(lambda: hand(record.root, record.env, "server", server)) and not Record(record.root, record.env).holds(""), \
        "a handover the server never took leaves this machine let go, never two writers, until hand is run again"
    server.loses_handovers = False
    assert hand(record.root, record.env, "server", server) == Lease("server-1", 5) == server.leases[record.env], "and running it again sends the same lease"


def test_syncing_sends_the_writes_that_waited_in_order_and_takes_in_what_happened_on_the_server_without_firing_features():
    record = fresh()
    join(record, Server(record.root))
    record.hand_over("", "server-1")
    for title in ("first", "second"):
        request(record.root, Request(record.env, "todo", "create", [title], actor=USER))
    assert ([held.asked.args for held in Waiting(record.root).waiting()], Outbox(record.root).waiting()) == ([["first"], ["second"]], []), \
        "a write into a scope the server writes waits for the server, not for this machine to hold the scope again"
    assert "still wait" in refused(lambda: hand(record.root, record.env, "here", Server(record.root))), "and is sent before the scope is taken back"
    server = Server(record.root)
    server.events_to_give = [Event(id=9000 + i, at=1.0, type="todo", n=900 + i, action="created", actor=AGENT, env=record.env) for i in range(2)]
    assert sync(record, server) == Synced(2, 2) and server.taken == ["first", "second"], "what waited goes oldest first, then the server's events come in"
    assert sync(record, server) == Synced(0, 0), "nothing is sent or taken in twice"
    assert [t.title for t in Todos(Record(record.root, record.env), actor=SYSTEM).all()] == [], "pulled events are in the log only, and no feature acted on them"


def git_in(folder):
    return lambda *args, cwd=folder: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True).stdout.strip()


def test_code_goes_through_git_as_snapshots_and_is_applied_only_over_files_not_changed_here(tmp_path):
    bare = tmp_path / "hosted.git"
    bare.mkdir()
    subprocess.run(["git", "init", "-q", "--bare"], cwd=bare, check=True)
    mine, theirs = tmp_path / "mine", tmp_path / "theirs"
    mine.mkdir()
    run = git_in(mine)
    run("init", "-q")
    (mine / "a.txt").write_text("one")
    run("add", "a.txt")
    run("commit", "-qm", "first")
    run("clone", "-q", str(mine), str(theirs), cwd=tmp_path)
    for folder in (mine, theirs):
        git_in(folder)("remote", "add", "hosted", str(bare))
    (mine / "a.txt").write_text("two")
    assert push(mine, "laptop") == Pushed((".",), ()), "the project's repository is snapshotted and pushed to its hosted remote"
    (theirs / "a.txt").write_text("mine")
    assert "also changed here" in refused(lambda: pull(theirs, "laptop")) and (theirs / "a.txt").read_text() == "mine", "a file edited here is never written over"
    (theirs / "a.txt").write_text("one")
    assert (pull(theirs, "laptop"), (theirs / "a.txt").read_text()) == (["a.txt"], "two"), "over a file only changed there the snapshot is applied"
    assert "no snapshot" in refused(lambda: pull(theirs, "nobody")), "a name nobody pushed is said plainly"


def test_a_hosted_world_runs_a_server_and_two_local_copies_as_real_processes_that_connect_and_sync(hosted_world):
    world = hosted_world
    world.start(world.server)
    world.start(world.laptop)
    world.start(world.desk)
    assert len({world.server.port, world.laptop.port, world.desk.port}) == 3 and all(copy.running() for copy in world.copies.values()), \
        "the server and both local copies each run in a process and folder of their own"
    asked = world.laptop.run("environment", "connect", "--address", world.server.address)
    assert "Traceback" not in asked.stderr, "a local copy can be told to connect to the server by its address, and answers in words whatever the server says"
    world.stop(world.server)
    assert not world.server.running(), "the server can be stopped and started again on the same port, as the failure cases need"
    port = world.server.port
    world.start(world.server)
    assert world.server.port == port and world.server.running(), "it comes back where it was"
    as_you = ("--as", "user")
    world.laptop.run(*as_you, "feature", "switch", "connection")
    assert "connected" in world.laptop.run(*as_you, "environment", "connect", "--address", world.server.address).stdout
    assert "from epoch 1" in world.laptop.run(*as_you, "environment", "hand", "main", "server").stdout, "the laptop hands its environment to the server"
    world.server.run(*as_you, "todo", "create", "Written on the server")
    assert "took in" in world.laptop.run(*as_you, "environment", "sync").stdout
    written = next(row.n for row in Todos(world.server.record(), actor=SYSTEM).all() if row.title == "Written on the server")
    assert any((event.type, event.action, event.n) == ("todo", "created", written) for event in world.laptop.record().event_log.events()), \
        "a write made on the server arrives on the laptop"
    sent = Write("laptop-1", "", Request("main", "todo", "create", ["Written on the laptop"], actor=USER))
    server = HttpTransport(world.server.address)
    assert [server.send(sent), server.send(sent)] == [Sent.TAKEN, Sent.TAKEN]
    assert [row.title for row in Todos(world.server.record(), actor=SYSTEM).all()].count("Written on the laptop") == 1, \
        "a write made on the laptop arrives on the server, once however often it is sent"


def test_a_server_that_refuses_stalls_or_has_been_taken_down_is_met_in_words_and_without_a_long_wait(tmp_path):
    with socket.socket() as closed:
        closed.bind(("127.0.0.1", 0))
        gone = closed.getsockname()[1]
    began = time.time()
    assert "Connection refused" in refused(lambda: HttpTransport(f"http://127.0.0.1:{gone}", timeout=1).hello()) and time.time() - began < 3, "a server that refuses the connection is met at once"
    assert HttpTransport(f"http://127.0.0.1:{gone}", timeout=1).send(Write("k", "", asked("x"))) is Sent.AWAY, "and a write sent to it is kept, not lost"
    with socket.socket() as stalled:
        stalled.bind(("127.0.0.1", 0))
        stalled.listen(1)
        began = time.time()
        assert refused(lambda: HttpTransport(f"http://127.0.0.1:{stalled.getsockname()[1]}", timeout=0.3).hello()) and time.time() - began < 3, "a server that accepts and never answers is given up on at the timeout"

    class Down(http.server.BaseHTTPRequestHandler):
        status = 503

        def do_POST(self):
            self.send_response(self.status)
            self.end_headers()

        do_GET = do_POST

        def log_message(self, *_):
            pass

    server = http.server.HTTPServer(("127.0.0.1", 0), Down)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        assert "taken down" in refused(lambda: HttpTransport(f"http://127.0.0.1:{server.server_port}").hello()), "a server taken down answers 503 and the refusal says so"
        outcomes = []
        for Down.status in (503, 500, 400, 403):
            outcomes.append(HttpTransport(f"http://127.0.0.1:{server.server_port}").send(Write("k", "", asked("x"))))
        assert outcomes == [Sent.AWAY, Sent.AWAY, Sent.REFUSED, Sent.REFUSED], "a write the server failed on is tried again, and one it refused is not"
    finally:
        server.shutdown()


def test_a_sync_that_meets_a_server_down_an_epoch_change_or_an_interrupted_push_keeps_what_waits_and_applies_nothing_twice():
    record = fresh()
    waiting = Waiting(record.root)
    for name in ("first", "second", "third"):
        waiting.hold("", asked(name))
    assert "does not answer" in refused(lambda: sync(record, Server(record.root, up=False))) and len(waiting.waiting()) == 3, "with the server down nothing is sent and every write is kept"
    moved = Server(record.root)
    answers = iter([moved.said, Hello(version(), Shape(PROTOCOL, moved.said.shape.migrations, 9), "server-1")])
    moved.hello = lambda: next(answers)
    assert "new epoch" in refused(lambda: sync(record, moved)) and waiting.waiting() == [], \
        "an epoch change in the middle of a sync stops it before anything is pulled, after what was sent has gone"
    again, taken, ran = Waiting(fresh().root), Applied(fresh().root), []
    for name in ("first", "second", "third"):
        again.hold("", asked(name))

    def interrupted(held):
        if held.asked.args[0] == "second":
            raise OSError("the connection dropped")
        return taken.apply(held, lambda write: ran.append(write.asked.args[0]))
    try:
        again.flush(interrupted)
    except OSError:
        pass
    assert ([w.asked.args[0] for w in again.waiting()], ran) == (["second", "third"], ["first"]), "a push cut off in the middle keeps what the server did not take and drops what it did"
    assert (again.flush(lambda held: taken.apply(held, lambda write: ran.append(write.asked.args[0]))).sent, ran) == (2, ["first", "second", "third"]), "the next try sends the rest, and nothing arrives twice"
    for name in ("fourth", "turned down", "fifth"):
        waiting.hold("", asked(name))
    server = Server(record.root)
    assert (sync(record, server).sent, server.taken, waiting.waiting(), [held.asked.args for held in waiting.refused()]) == (2, ["fourth", "fifth"], [], [["turned down"]]), \
        "a write the server refused is set aside and the writes after it still go, in order"
    assert any("turned down changes" in n.title and "turned down" in n.brief for n in Notices(record, actor=SYSTEM).all()), "and a notice names what was set aside"


def test_a_handover_with_a_stale_lease_is_refused_on_both_sides():
    from engine.handover import accept, give
    from engine.machines import Pushing
    here, there = fresh(), fresh()
    first = give(here, "", "server-1")
    accept(there, "", first)
    second = Lease("laptop-2", 2)
    accept(there, "", second)
    assert "older" in refused(lambda: accept(there, "", first)), "a handover that arrives after a newer one is refused, not applied over it"
    stale = Record(there.root, there.env, writer=Pushing("server-1"))
    assert "refused" in refused(lambda: Todos(stale, actor=AGENT).create("pushed by the old holder")), "a push from the machine that held it before is refused"
    assert "refused" in refused(lambda: give(here, "", "desk")), "and a machine that already handed an environment over cannot hand it on again"


def test_the_sync_routes_are_safe_to_ask_twice_name_who_holds_an_environment_and_a_lost_answer_no_one_can_settle_is_refused():
    from dataclasses import asdict
    from tests.kit import dispatch
    features.load()
    server = fresh()
    root, env = server.root, server.env
    ask = lambda path, body: dispatch("POST", f"/api/sync/{path}", root, {}, body)
    hello = dispatch("GET", "/api/sync/hello", root, {}, {})
    assert (hello.code, hello.body["machine"]) == (200, this_machine()), "the server says who it is"
    handed = {"env": env, "machine": this_machine(), "epoch": 1}
    assert ([ask("handover", handed).code, ask("handover", handed).code], Lease.read(server.scope_home(""))) == ([200, 200], Lease(this_machine(), 1)), \
        "a handover sent again after a lost answer is taken once"
    assert ask("holder", {"env": env}).body == {"machine": this_machine(), "epoch": 1}, "the server names who holds an environment and from which epoch"
    assert [ask("handback", {"env": env, "machine": "laptop-1"}).body for _ in range(2)] == [{"machine": "laptop-1", "epoch": 2}] * 2, \
        "a handback asked again names the lease it already gave"
    late = asdict(Write("late-1", "", Request(env, "todo", "create", ["Sent after the server let go"], actor=USER)))
    assert (ask("write", late).code, [row.title for row in Todos(server, actor=SYSTEM).all()]) == (400, []), \
        "a write into an environment the server no longer holds is refused, so the copy sets it aside"
    rule = Rules(server, actor=AGENT).create("Keep it plain", brief="why", keywords="plain")
    project = ask("events", {"scope": PROJECT, "env": env, "since": 0}).body["events"]
    own = ask("events", {"scope": "", "env": env, "since": 0}).body["events"]
    assert (any(e["type"] == "rule" and e["n"] == rule.n for e in project), any(e["type"] == "rule" for e in own)) == (True, False), \
        "the project's events come from the project's log and an environment's from its own"

    class Unreachable(Server):
        def holder(self, env):
            raise OSError("the server went away")

    class HandsElsewhere(Server):
        def handback(self, env):
            return Lease("desk-2", 9)
    record = fresh()
    gone = Unreachable(record.root)
    gone.loses_handovers = True
    assert "cannot be asked who holds it" in refused(lambda: hand(record.root, record.env, "server", gone)) and not Record(record.root, record.env).holds(""), \
        "a handover whose answer is lost while the server cannot be asked leaves this machine let go and says to run hand again"
    assert "not to this machine" in refused(lambda: hand(record.root, record.env, "here", HandsElsewhere(record.root))), \
        "a handback that names another machine is never taken here"
    Features(record, actor=USER).switch("connection", True)
    assert "name the server first" in refused(lambda: Environments(record, actor=USER).action("sync")()), "syncing with no server named says how to name one"
