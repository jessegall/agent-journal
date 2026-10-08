import io
import json
import time
from types import SimpleNamespace

from controllers.types import Questions
from features.integrations.test import issue, linear_world
from features.integrations.commands import SyncIntegration
from features.linear.commands import ProposeComment
from features.linear.reading import reply_of
from features.linear.routes import WEBHOOK_BODY, LinearWebhook
from features.linear.webhook import BODY_LIMIT, event_of, signed
from features.tickets.controller import Tickets
from resources.base import AGENT, SYSTEM, Refused
from tests.conftest import refused

SECRET = "the signing secret"


def test_a_webhook_event_without_a_secret_too_large_or_not_json_is_refused_and_the_address_answers_in_status_codes():
    now = time.time()
    body = json.dumps({"type": "Issue", "action": "update", "webhookTimestamp": int(now * 1000), "data": {"id": "id-1"}}).encode()
    large, garbled = b" " * (BODY_LIMIT + 1), b"not json"
    assert "no signing secret" in refused(lambda: event_of(body, signed(SECRET, body), "", now)), "with no signing secret picked no event is taken"
    assert "too large" in refused(lambda: event_of(large, signed(SECRET, large), SECRET, now)), "an event past the cap is refused before its signature is weighed"
    assert "not JSON" in refused(lambda: event_of(garbled, signed(SECRET, garbled), SECRET, now)), "a signed body that is not JSON is refused"
    assert (event_of(body, signed(SECRET, body), SECRET, now).kind, event_of(body, signed(SECRET, body), SECRET, now).data.id) == ("Issue", "id-1"), \
        "a signed, fresh event is read into its kind and the issue it names"
    taken, answered = [], []

    def take(record, raw: bytes, signature: str) -> None:
        if signature != signed(SECRET, raw):
            raise Refused("the event is not signed with the signing secret")
        taken.append(raw)

    def delivery(raw: bytes, signature: str, length: int | None = None):
        return SimpleNamespace(headers={"Content-Length": str(len(raw) if length is None else length), "Linear-Signature": signature}, rfile=io.BytesIO(raw),
                               shares=SimpleNamespace(record=None), send=lambda code, text, headers: answered.append(code))
    address = LinearWebhook(SimpleNamespace(take=take))
    address.get(delivery(body, signed(SECRET, body)), ["webhook"])
    address.post(delivery(body, signed(SECRET, body)), ["elsewhere"])
    address.post(delivery(body, signed(SECRET, body), WEBHOOK_BODY + 1), ["webhook"])
    address.post(delivery(body, "00" * 32), ["webhook"])
    address.post(delivery(body, signed(SECRET, body)), ["webhook"])
    assert (answered, taken) == ([404, 404, 413, 401, 200], [body]), \
        "the webhook answers only a POST to its own address, refuses a body past the cap and an unsigned event, and takes a signed one"


def test_an_answer_from_linear_that_is_not_json_or_carries_errors_is_refused_with_its_message():
    assert "not JSON" in refused(lambda: reply_of("<html>Bad gateway</html>")), "an answer that is not JSON is refused"
    assert "Linear refused the request: Authentication required" in refused(lambda: reply_of(json.dumps({"errors": [{"message": "Authentication required"}]}))), \
        "an answer carrying errors is refused with Linear's own message"
    assert reply_of(json.dumps({"data": {}})).errors == (), "an answer with data and no errors is read"


def test_a_comment_is_proposed_only_on_a_ticket_from_linear_its_sync_word_checks_it_and_an_agent_never_moves_a_ticket_off_linear(monkeypatch, tmp_path):
    world = linear_world(monkeypatch, tmp_path, teams=[{"id": "t1", "key": "ENG", "name": "Engineering"}],
                         states=[{"id": "s1", "name": "Todo", "team": {"id": "t1"}}], issues=[issue(1, "2026-10-01T10:00:00Z")])
    record = world.record
    world.linear.check(record)
    ticket = next(t for t in Tickets(record, actor=SYSTEM).rows.standing() if t.source == "linear")
    context = SimpleNamespace(record=record, feature=world.linear)
    ours = SimpleNamespace(load=lambda n: SimpleNamespace(source="", source_id="", ref="ticket:99"))
    assert "did not come from Linear" in refused(lambda: ProposeComment().run(context, ours, 99, "Looks fixed")), "a comment is proposed only on a ticket from Linear"
    answer = ProposeComment().run(context, Tickets(record, actor=AGENT), ticket.n, "  Looks fixed on main  ")
    asked = Questions(record, actor=SYSTEM).all()[-1]
    assert ("nothing is sent" in answer, asked.brief, asked.data.get("proposal"), world.fake.comments) == (True, "Looks fixed on main", "linear", []), \
        "a proposed comment waits as your question and nothing reaches Linear"
    assert (SyncIntegration("linear").name, SyncIntegration("linear").run(context, None)) == ("sync_linear", f"checked {world.linear.details.title}"), \
        "Linear's own sync word checks it now and says so"
    assert "change the source" in refused(lambda: Tickets(record, actor=AGENT).update(ticket.n, source="")), "an agent cannot move a ticket off Linear"


def test_linear_is_told_the_tunnel_or_server_address_and_a_write_it_refuses_is_kept_not_raised(monkeypatch, tmp_path):
    from features.integrations.state import read_state
    world = linear_world(monkeypatch, tmp_path, teams=[{"id": "t1", "key": "ENG", "name": "Engineering"}])
    record, linear = world.record, world.linear
    addresses = {"own": [], "kept": {}}
    monkeypatch.setattr("features.linear.working.own_address", lambda record: addresses["own"])
    monkeypatch.setattr("features.linear.working.kept_address", lambda root: addresses["kept"])
    assert linear.webhook_address(record) == "", "with no tunnel and no server address, Linear is told no address"
    addresses["kept"] = {"host": "tunler.example"}
    assert linear.webhook_address(record) == "", "nor with a tunnel host but no subdomain of its own"
    addresses["kept"] = {"subdomain": "home", "host": "tunler.example"}
    assert linear.webhook_address(record) == "https://home.tunler.example/linear/webhook", "a tunnel's own subdomain is the address"
    addresses["own"] = ["journal.example.com"]
    assert linear.webhook_address(record) == "https://journal.example.com/linear/webhook", "and a journal on a server answers at its own domain first"

    def refused_write(client):
        raise Refused("Linear refused the request: Entity not found")
    linear.push(record, refused_write)
    assert read_state(record.root, "linear").last_error == "Linear refused the request: Entity not found", \
        "a write Linear refuses is kept in the integration's state, never raised into the move or the answer that sent it"
