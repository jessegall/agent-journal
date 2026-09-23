import re
from dataclasses import asdict
from pathlib import Path

from controllers.types import Agents, Notices, Notifications
from engine.inputs import BACKGROUND, FORCE, PERMIT, QueuedCommand, SHELL, STALE, queue, waiting_commands
from engine.record import Record
from engine.seats import live
from engine.terminal import relaunch as restart
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM, Refused

RELOAD_GRACE = 60.0


def configured(provider: str, current_model: str = "") -> tuple[type, dict]:
    cls = PROVIDERS.get(provider)
    return cls, cls.control_options(current_model) if cls else {"groups": [], "note": "This CLI does not expose model controls."}


def current(group: str, value: str, model: str, effort: str) -> bool:
    if group == "model":
        return value == model or value in re.split(r"[-\[\]]", model)
    return group == "effort" and value == effort


def options(provider: str, current_model: str = "", current_effort: str = "") -> dict:
    _, controls = configured(provider, current_model)
    return {
        "provider": provider,
        "groups": [
            {**group, "choices": [{**{k: v for k, v in choice.items() if k not in ("command", "commands")},
                                   "current": current(group["key"], choice["value"], current_model, current_effort)} for choice in group["choices"]]}
            for group in controls["groups"]
        ],
        "note": controls["note"],
    }


def choice(provider: str, action: str, value: str, current_model: str = "") -> dict:
    cls = PROVIDERS.get(provider)
    if not cls:
        raise Refused(f"{provider or 'this agent'} does not support {action} {value!r}")
    return cls.control_choice(action, value, current_model)


CARRY_ON = "Carry on with what you were doing; the model or effort change you were interrupted for is done."


def online(root: Path, env: str, session: str) -> dict:
    found = next((agent for _, agent in live(Path(root), within=RELOAD_GRACE) if agent.session == session), None)
    if not found:
        raise Refused(f"session {session!r} is not online")
    if found.environment != env:
        raise Refused(f"session {session!r} belongs to environment {found.environment!r}")
    return found


def delivered(record, sessions: set[str], action: str, label: str) -> None:
    notices = Notices(record, actor=SYSTEM)
    for notice in notices._every():
        if not notice.completed and notice.data.get("action") == action and notice.data.get("session") in sessions:
            notices.complete(notice.n, how="delivered")
    Notifications(record, actor=SYSTEM)._logged(f"{action.capitalize()} set to {label.lower()}", brief=f"The {action} change was typed into the agent.")


def pressed(root: Path, env: str, session: str, label: str, action: str) -> dict:
    found = online(root, env, session)
    queued = queue(Path(root), session, "", label, provider=found.provider, action=action)
    return queued.for_viewer


def force(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Force through", FORCE)


def move_to_background(root: Path, env: str, session: str) -> dict:
    return pressed(root, env, session, "Move to the background", BACKGROUND)


def shell(root: Path, env: str, session: str, command: str) -> dict:
    found = online(root, env, session)
    if not DRIVERS[found.provider].SHELL:
        raise Refused(f"{found.provider} has no shell command to type")
    if not command.strip():
        raise Refused("type a command to run")
    queued = queue(Path(root), session, "", f"Run {command.strip()}", provider=found.provider, action=SHELL, value=command.strip())
    agents = Agents(Record(Path(root), env), actor=SYSTEM)
    row = agents.by_session(session)
    waiting = [c for c in waiting_commands(row) if queued.at - c.at < STALE]
    agents.update(row.n, queued_commands=[*(asdict(c) for c in waiting), asdict(QueuedCommand(queued.at, queued.value))])
    return queued.for_viewer


def permit(root: Path, env: str, session: str, allow: bool) -> dict:
    found = online(root, env, session)
    answer = "allow" if allow else "deny"
    queued = queue(Path(root), session, "", answer.capitalize(), provider=found.provider, action=PERMIT, value=answer)
    return queued.for_viewer


def relaunch(root: Path, env: str, session: str, skip: bool) -> dict:
    found = online(root, env, session)
    record = Record(Path(root), env)
    record.set_setting("permission_prompts", {**record.setting("permission_prompts", {}), "skip": skip})
    restart(Path(root), env, found.terminal, session)
    return {"relaunching": True, "skip": skip}


def request(root: Path, env: str, session: str, action: str, value: str) -> dict:
    root = Path(root)
    found = online(root, env, session)
    selected = choice(found.provider, action, value, found.model)
    commands = selected.get("commands") or [selected["command"]]
    queued = None
    for line in commands:
        queued = queue(root, session, line, selected["label"], provider=found.provider, action=action, value=value)
    record = Record(root, env)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(session)
    agents.update(row.n, pending={**row.pending, action: {"value": value, "at": queued.at}})
    Notices(record, actor=SYSTEM).create(f"Setting {action} to {selected['label'].lower()} — waiting for the agent", tone="note", session=session, action=action)
    return queued.for_viewer
