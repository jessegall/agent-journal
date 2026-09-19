from pathlib import Path

from controllers.types import Agents, CONTROLLERS
from resources.base import Refused, SYSTEM, shown

VERSION = 1
HOOK = "hook"


def named(event) -> str:
    return f"{HOOK}.{event.data[HOOK]}" if event.type == "agent" and event.data.get(HOOK) else f"{event.type}.{event.action}"


def resource(record, event) -> dict | None:
    controller = CONTROLLERS.get(event.type)
    if not controller:
        return None
    try:
        return shown(controller(record, actor=SYSTEM).load(event.n))
    except Refused:
        return None


def agent(record, session: str) -> dict:
    agents = Agents(record, actor=SYSTEM)
    row = next((r for r in agents.all() if r.title == session), None) if session else agents.primary()
    return {"session": row.title, "status": row.status, "model": row.model, "cwd": row.cwd} if row else {}


def of(record, event, plugin: str, where: Path) -> dict:
    return {"v": VERSION, "event": named(event), "id": event.id, "at": event.at,
            "type": event.type, "n": event.n, "action": event.action, "actor": event.actor, "data": dict(event.data),
            "env": record.env, "project": str(record.root.parent),
            "resource": resource(record, event),
            "agent": agent(record, str(event.data.get("session") or "")),
            "plugin": {"name": plugin, "dir": str(where)}}


def refusal(record, hook, plugin: str, where: Path, writes: bool) -> dict:
    return {"v": VERSION, "event": f"{HOOK}.{hook.event}", "env": record.env, "project": str(record.root.parent),
            "agent": agent(record, hook.session),
            "tool": {"name": hook.tool.name, "file": hook.tool.file_path, "command": hook.command, "writes": writes},
            "plugin": {"name": plugin, "dir": str(where)}}
