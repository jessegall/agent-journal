from pathlib import Path
from typing import TypedDict

from engine import runtime
from engine.record import Record
from engine.services import status
from features.tickets.controller import Tickets
from resources.base import SYSTEM

APP = "app"


def service_of(ticket) -> str:
    return f"{ticket.work_environment}.{APP}"


def worktree_of(project: Path, ticket) -> Path:
    from providers import DRIVERS
    return project.joinpath(*DRIVERS[ticket.provider].WORKTREES, ticket.work_environment)


def hosted(root: Path) -> list:
    return [r for r in Tickets(Record(root, runtime.env(root)), actor=SYSTEM).rows.standing() if r.hosted and r.work_environment]


class AppAddress(TypedDict):
    url: str
    state: str
    why: str


def address(root: Path, ticket) -> AppAddress:
    state = status(root, service_of(ticket))
    return {"url": state.url, "state": state.state or "not started", "why": state.why}


def idle_past(ticket, minutes: int, now: float) -> bool:
    return bool(ticket.idle_since) and now - ticket.idle_since >= minutes * 60


def app_here(record) -> str:
    ticket = next((r for r in hosted(record.root) if r.work_environment == record.env), None)
    return address(record.root, ticket)["url"] if ticket else ""
