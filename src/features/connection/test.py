import features
from controllers.types import Notices, Todos
from engine.machines import Lease, this_machine
from engine.offline import Waiting
from engine.record import Record
from engine.sync import PROTOCOL, Comparison, Hello, Release, Shape, Step
from engine.version import version
from features.connection.linking import hand, join, local_hello, sync
from migrations import applied
from resources.base import AGENT, SYSTEM, USER, Event
from tests.conftest import fresh, refused


class Server:
    """A stand-in for the journal on a server: it answers as told and keeps what it was sent."""

    def __init__(self, root, epoch=0, up=True):
        self.said = Hello(version(), Shape(PROTOCOL, frozenset(applied(root)), epoch), "server-1")
        self.up, self.handed, self.taken, self.events_to_give = up, [], [], []

    def hello(self):
        if not self.up:
            raise OSError("the server does not answer")
        return self.said

    def handover(self, env, lease):
        if not self.up:
            raise OSError("the server does not answer")
        self.handed.append((env, lease))

    def handback(self, env):
        return Lease(this_machine(), 2)

    def send(self, held):
        self.taken.append(held.args[0])
        return self.up

    def events(self, scope, env, since):
        return [e for e in self.events_to_give if e.id > since]


def test_connecting_checks_the_server_and_keeps_what_it_found_and_a_server_that_does_not_answer_becomes_a_notice(monkeypatch):
    features.load()
    record = fresh()
    assert join(record, Server(record.root)).release is Release.SAME and record.state("connection").get("welcome")["step"] == Step.IN_STEP.value, \
        "a server on the same release and record shape is joined as it is"
    assert join(record, Server(record.root, epoch=5)).comparison == Comparison(Step.PULL_AGAIN), "a server in another epoch, such as after a restore, makes this copy pull everything again"
    assert local_hello(record).machine == this_machine(), "the check names this machine"
    monkeypatch.setattr("features.connection.feature.transport_for", lambda address: Server(record.root, up=False))
    record.change_setting("connection", {"address": "https://server.example"})
    features.FEATURES["connection"].settings_changed(record, USER)
    assert any("Could not connect" in n.title for n in Notices(record, actor=SYSTEM).all()), "an address nobody answers at becomes a notice, not an error"


def test_an_environment_goes_to_the_server_only_once_it_has_taken_the_new_epoch_and_comes_back_through_the_same_lease():
    record = fresh()
    down = Server(record.root, up=False)
    assert "does not answer" in refused(lambda: hand(record.root, record.env, "server", down)) and record.holds(""), \
        "a server that does not answer takes nothing and this machine keeps the environment"
    Waiting(record.root).hold("", "todo", "create", ["waits"])
    assert "still wait" in refused(lambda: hand(record.root, record.env, "server", Server(record.root))) and record.holds(""), "writes still waiting go first"
    Waiting(record.root).flush(lambda held: True)
    server = Server(record.root)
    lease = hand(record.root, record.env, "server", server)
    assert (lease, server.handed, record.holds("")) == (Lease("server-1", 1), [(record.env, Lease("server-1", 1))], False), \
        "the server is told the new lease and this machine lets the environment go"
    back = hand(record.root, record.env, "here", server)
    assert (back, Record(record.root, record.env).holds("")) == (Lease(this_machine(), 2), True), "handing it back takes the lease the server made, once"
    assert "server or to here" in refused(lambda: hand(record.root, record.env, "mars", server)), "an environment goes to the server or comes here, nowhere else"


def test_syncing_sends_the_writes_that_waited_in_order_and_takes_in_what_happened_on_the_server_without_firing_features():
    record = fresh()
    Waiting(record.root).hold("", "todo", "create", ["first"])
    Waiting(record.root).hold("", "todo", "create", ["second"])
    record.hand_over("", "server-1")
    server = Server(record.root)
    server.events_to_give = [Event(id=9000 + i, at=1.0, type="todo", n=900 + i, action="created", actor=AGENT, env=record.env) for i in range(2)]
    assert sync(record, server) == {"sent": 2, "pulled": 2} and server.taken == ["first", "second"], "what waited goes oldest first, then the server's events come in"
    assert sync(record, server) == {"sent": 0, "pulled": 0}, "nothing is sent or taken in twice"
    assert [t.title for t in Todos(Record(record.root, record.env), actor=SYSTEM).all()] == [], "pulled events are in the log only, and no feature acted on them"
