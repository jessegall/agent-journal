import time

import features
from controllers.base import COMMANDS
from features.hosting.apps import ticket_apps
from engine.services import specs
from features.tickets.controller import Tickets
from resources.base import USER
from tests.conftest import fresh, refused


def test_a_hosted_ticket_runs_its_app_from_its_worktree_until_it_is_stopped_or_idle():
    from features import FEATURES
    from features.hosting.handlers import StopIdleApps
    from features.parts import AgentContext
    features.load()
    record = fresh()
    tickets = Tickets(record, actor=USER)
    ticket = tickets.create("Dark mode")
    host = lambda n: COMMANDS["ticket"]["host"](tickets, n)
    assert "names no app" in refused(lambda: host(ticket.n)), "without a hosting file there is nothing to run"
    folder = record.root.parent / "agentic-organization"
    folder.mkdir()
    (folder / "hosting.toml").write_text('run = "npm run dev -- --port {port}"\nready = "/health"\nidle_minutes = 5\n')
    host(ticket.n)
    [app] = ticket_apps(record.root, set())
    assert (app.id, app.cwd.endswith(f".claude/worktrees/ticket-{ticket.n}"), app.run, app.path) == \
        (f"ticket-{ticket.n}.app", True, f"npm run dev -- --port {app.port}", "/health"), "the app runs from the ticket's worktree on a port of its own"
    sweep = lambda: StopIdleApps().handle(AgentContext.of(FEATURES["hosting"], record, None), None)
    sweep()
    tickets.update(ticket.n, idle_since=time.time() - 6 * 60)
    sweep()
    assert (tickets.load(ticket.n).hosted, ticket_apps(record.root, set())) == (False, []), \
        "an app whose ticket's agent is gone past the idle minutes stops"


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
