import time

import features
from controllers.base import COMMANDS
from features.hosting.services import ticket_apps
from engine.services import specs
from features.tickets.controller import Tickets
from resources.base import USER
from tests.conftest import fresh, refused


def test_a_hosted_ticket_runs_its_app_from_its_worktree_until_it_is_stopped_or_idle(monkeypatch):
    from features import FEATURES
    from features.hosting.handlers import StopIdleApps
    from features.parts import AgentContext
    features.load()
    record = fresh()
    tickets = Tickets(record, actor=USER)
    ticket = tickets.create("Dark mode")
    host = lambda n: COMMANDS["ticket"]["host"](tickets, n)
    from features.hosting import card
    assert "names no app" in refused(lambda: host(ticket.n)), "without a hosting file there is nothing to run"
    assert card.app_on_card(record, ticket).actions == [], "a ticket's card offers no app while the project names none"
    folder = record.root.parent / "agentic-organization"
    folder.mkdir()
    (folder / "hosting.toml").write_text('run = "npm run dev -- --port {port}"\nready = "/health"\nidle_minutes = 5\n')
    assert [action["action"] for action in card.app_on_card(record, ticket).actions] == ["host"], "a card offers to run its app once the project names one"
    host(ticket.n)
    hosted = tickets.load(ticket.n)
    assert [action["action"] for action in card.app_on_card(record, hosted).actions] == ["unhost"], "a card whose app runs offers to stop it"
    for state, extra in (({"state": card.READY, "url": "http://app.example"}, ("http://app.example", "Open app")), ({"state": "starting", "why": ""}, ("", "App starting")),
                         ({"state": "crashed", "why": "port taken"}, ("", "App stopped: port taken"))):
        monkeypatch.setattr(card, "address", lambda root, found, state=state: state)
        assert (card.app_on_card(record, hosted).link, card.app_on_card(record, hosted).link_label) == extra, "a card links to its app once ready and says why it is not"
    monkeypatch.undo()
    assert COMMANDS["ticket"]["app"](tickets, ticket.n) == {"url": "", "state": "not started", "why": ""}, "the address of an app that was never started says so"
    [app] = ticket_apps(record.root, set())
    assert (app.id, app.cwd.endswith(f".claude/worktrees/ticket-{ticket.n}"), app.run, app.path) == \
        (f"ticket-{ticket.n}.app", True, f"npm run dev -- --port {app.port}", "/health"), "the app runs from the ticket's worktree on a port of its own"
    sweep = lambda: StopIdleApps().handle(AgentContext.of(FEATURES["hosting"], record, None), None)
    sweep()
    tickets.update(ticket.n, idle_since=time.time() - 6 * 60)
    sweep()
    assert (tickets.load(ticket.n).hosted, ticket_apps(record.root, set())) == (False, []), \
        "an app whose ticket's agent is gone past the idle minutes stops"
    host(ticket.n)
    COMMANDS["ticket"]["unhost"](tickets, ticket.n)
    assert (tickets.load(ticket.n).hosted, ticket_apps(record.root, set())) == (False, []), "an app stopped by hand stops at once"
    host(ticket.n)
    tickets.update(ticket.n, idle_since=time.time() - 3 * 60)
    monkeypatch.setattr(Tickets, "agent_session", lambda self, n: "claude-1")
    sweep()
    assert tickets.load(ticket.n).idle_since == 0.0, "an app whose ticket has an agent at work is not counted idle"


def test_hosting_services_follow_the_feature_switch():
    from controllers.types import Features
    from engine.runtime import set_env
    from features.switches import booted

    features.load()
    record = fresh()
    set_env(record.root, record.env)
    Tickets(record, actor=USER).create("A hosted app", hosted=True, work_environment="ticket-1")
    assert any(spec.service == "app" for spec in specs(record.root, [])) is False
    folder = record.root.parent / "agentic-organization"
    folder.mkdir()
    (folder / "hosting.toml").write_text('run = "npm run dev -- --port {port}"\nready = "/health"\n')
    assert any(spec.service == "app" for spec in specs(record.root, []))
    Features(record, actor=USER).create("hosting", enabled=False)
    booted(record)
    assert all(spec.service != "app" for spec in specs(record.root, []))


def test_a_service_counts_as_answering_by_its_port_or_its_address_and_a_gone_group_is_noticed():
    import http.server
    import socket
    import threading
    from engine import keeper

    assert keeper.answers(0, "/x") is True, "a service with no port has nothing to answer"
    free = socket.socket()
    free.bind(("127.0.0.1", 0))
    closed = free.getsockname()[1]
    free.close()
    assert (keeper.answers(closed, ""), keeper.answers(closed, "/x")) == (False, False), "nothing listening does not answer, by port or by address"

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response({"/ok": 200, "/missing": 404, "/broken": 503}[self.path])
            self.end_headers()

        def log_message(self, *args):
            return None
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    port = server.server_port
    try:
        assert (keeper.answers(port, ""), keeper.answers(port, "/ok"), keeper.answers(port, "/missing"), keeper.answers(port, "/broken")) == (True, True, True, False), \
            "an open port answers, and so does any address that is not a server error"
        assert keeper.answers(port, "/bad address with spaces") is False, "an address that cannot be asked is not an answer"
    finally:
        server.shutdown()
        server.server_close()
    assert keeper.gone(2 ** 22 + 7) is True, "a process group that does not exist is gone"
