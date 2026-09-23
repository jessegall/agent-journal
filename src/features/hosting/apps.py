import time
from dataclasses import dataclass
from pathlib import Path

from engine import runtime
from engine.keeper import ServiceSpec
from engine.record import Record
from engine.services import allocate, files_for, status
from features.hosting.files import hosting_of
from features.plugins.manifest import fill
from features.tickets.controller import Tickets
from resources.base import SYSTEM

APP = "app"


def service_of(ticket) -> str:
    return f"{ticket.work_environment}.{APP}"


def worktree_of(project: Path, ticket) -> Path:
    from providers import DRIVERS
    return project.joinpath(*DRIVERS[ticket.agent].WORKTREES, ticket.work_environment)


def hosted(root: Path) -> list:
    return [r for r in Tickets(Record(root, runtime.env(root)), actor=SYSTEM)._standing() if r.hosted and r.work_environment]


def ticket_apps(root: Path, taken: set) -> list:
    hosting = hosting_of(root.parent)
    if not hosting:
        return []
    apps = []
    for ticket in hosted(root):
        sid = service_of(ticket)
        port, blocked = allocate(root, sid, None, taken)
        taken.add(port)
        where = worktree_of(root.parent, ticket)
        places = {"port": port, "worktree": str(where)}
        apps.append(ServiceSpec(id=sid, plugin=ticket.work_environment, service=APP, run=fill(hosting.run, places), cwd=str(where),
                                env={"PORT": str(port)}, path=hosting.ready, port=port, blocked=blocked, url=f"http://127.0.0.1:{port}", **files_for(root, sid)))
    return apps


def address(root: Path, ticket) -> dict:
    state = status(root, service_of(ticket))
    return {"url": state.url, "state": state.state or "not started", "why": state.why}


def idle(tickets, ticket, minutes: int) -> bool:
    if tickets.agent_session(ticket.n):
        tickets.update(ticket.n, idle_since=0.0)
        return False
    if not ticket.idle_since:
        tickets.update(ticket.n, idle_since=time.time())
        return False
    return time.time() - ticket.idle_since >= minutes * 60


def app_here(record) -> str:
    ticket = next((r for r in hosted(record.root) if r.work_environment == record.env), None)
    return address(record.root, ticket)["url"] if ticket else ""


@dataclass(frozen=True)
class CardExtra:
    actions: list
    link: str = ""


def app_on_card(record, ticket) -> CardExtra:
    if not hosting_of(record.root.parent):
        return CardExtra([])
    if not ticket.hosted:
        return CardExtra([{"label": "Run its app", "action": "host"}])
    return CardExtra([{"label": "Stop its app", "action": "unhost"}], address(record.root, ticket)["url"])
