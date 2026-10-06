import re
from dataclasses import asdict
from pathlib import Path

from controllers.types import Agents, Notices
from engine.inputs import BACKGROUND, FORCE, PAUSE, PERMIT, QueuedCommand, RESUME, SHELL, STALE, queue, waiting_commands
from engine.record import Record
from engine.seats import live_session, offline
from providers.drivers import AGENT_COMMAND
from agents.terminal import relaunch as relaunch_session
from providers import DRIVERS, PROVIDERS
from providers.base import Provider
from resources.base import SYSTEM, Refused
from typing import TypedDict

RELOAD_GRACE = 60.0


def current(group: str, value: str, model: str, effort: str) -> bool:
    if group == "model":
        return value == model or value in re.split(r"[-\[\]]", model)
    return group == "effort" and value == effort


class ControlOptions(TypedDict):
    provider: str
    groups: list[dict]
    note: str


def options(provider: str, current_model: str, current_effort: str) -> ControlOptions:
    controls = PROVIDERS.get(provider, Provider).control_options(current_model)
    return {
        "provider": provider,
        "groups": [
            {**group, "choices": [{**{k: v for k, v in choice.items() if k not in ("command", "commands")},
                                   "current": current(group["key"], choice["value"], current_model, current_effort)} for choice in group["choices"]]}
            for group in controls["groups"]
        ],
        "note": controls["note"],
    }


def choice(provider: str, action: str, value: str, current_model: str) -> dict:
    cls = PROVIDERS.get(provider)
    if not cls:
        raise Refused(f"{provider or 'this agent'} does not support {action} {value!r}")
    return cls.control_choice(action, value, current_model)


def online(root: Path, env: str, session: str) -> dict:
    pair = live_session(Path(root), session, within=RELOAD_GRACE)
    if not pair:
        raise Refused(offline(Path(root), session, within=RELOAD_GRACE))
    found = pair[1]
    if found.environment != env:
        raise Refused(f"session {session!r} belongs to environment {found.environment!r}")
    return found


def pressed(root: Path, env: str, session: str, label: str, action: str, value: str = "") -> dict:
    found = online(root, env, session)
    queued = queue(Path(root), session, (), label, provider=found.provider, action=action, value=value)
    return queued.for_viewer


def force(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Force through", FORCE)


def pause(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Pause", PAUSE)


def resume(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Resume", RESUME)


def move_to_background(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Move to the background", BACKGROUND)


def shell(root: Path, env: str, session: str, command: str, now: bool = False) -> dict:
    found = online(root, env, session)
    if not command.strip():
        raise Refused("type a command to run")
    for_agent = command.strip().startswith(AGENT_COMMAND)
    if not for_agent and not DRIVERS[found.provider].SHELL:
        raise Refused(f"{found.provider} has no shell command to type")
    queued = queue(Path(root), session, (), f"Run {command.strip()}", provider=found.provider, action=SHELL, value=command.strip())
    if for_agent:
        return queued.for_viewer
    agents = Agents(Record(Path(root), env), actor=SYSTEM)
    row = agents.by_session(session)
    waiting = [c for c in waiting_commands(row) if queued.at - c.at < STALE]
    agents.update(row.n, queued_commands=[*(asdict(c) for c in waiting), asdict(QueuedCommand(queued.at, queued.value))])
    if now:
        queue(Path(root), session, (), "Run now", provider=found.provider, action=FORCE)
    return queued.for_viewer


def permit(root: Path, env: str, session: str, allow: bool) -> dict:
    answer = "allow" if allow else "deny"
    return pressed(root, env, session, answer.capitalize(), PERMIT, answer)


def relaunch(root: Path, env: str, session: str) -> dict:
    found = online(root, env, session)
    relaunch_session(Path(root), env, found.terminal, session)
    return {"relaunching": True}


def request(root: Path, env: str, session: str, action: str, value: str) -> dict:
    root = Path(root)
    found = online(root, env, session)
    selected = choice(found.provider, action, value, found.model)
    queued = queue(root, session, selected.get("commands") or [selected["command"]], selected["label"], provider=found.provider, action=action, value=value)
    record = Record(root, env)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(session)
    agents.update(row.n, pending={**row.pending, action: {"value": value, "at": queued.at}})
    waits = "" if action in PROVIDERS[found.provider].applies_at_once else " — waiting for the agent"
    Notices(record, actor=SYSTEM).create(f"Setting {action} to {selected['label'].lower()}{waits}", tone="note", session=session, action=action)
    return queued.for_viewer
