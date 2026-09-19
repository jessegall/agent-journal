from pathlib import Path

from controllers.types import Agents
from engine.inputs import FORCE, queue
from engine.record import Record
from engine.seats import live
from providers import PROVIDERS
from resources.base import SYSTEM, Refused


def configured(provider: str, current_model: str = "") -> tuple[type, dict]:
    cls = PROVIDERS.get(provider)
    return cls, cls.control_options(current_model) if cls else {"groups": [], "note": "This CLI does not expose model controls."}


def options(provider: str, current_model: str = "") -> dict:
    _, controls = configured(provider, current_model)
    return {
        "provider": provider,
        "groups": [
            {**group, "choices": [{k: v for k, v in choice.items() if k not in ("command", "commands")} for choice in group["choices"]]}
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
    found = next((agent for _, agent in live(Path(root)) if agent["session"] == session), None)
    if not found:
        raise Refused(f"session {session!r} is not online")
    if found["environment"] != env:
        raise Refused(f"session {session!r} belongs to environment {found['environment']!r}")
    return found


def force(root: Path, env: str, session: str) -> dict:
    found = online(root, env, session)
    queued = queue(Path(root), session, "", "Force through", provider=found["provider"], action=FORCE)
    return {k: v for k, v in queued.items() if k != "line"} | {"queued": True}


def request(root: Path, env: str, session: str, action: str, value: str) -> dict:
    root = Path(root)
    found = online(root, env, session)
    selected = choice(found["provider"], action, value, found.get("model", ""))
    commands = selected.get("commands") or [selected["command"]]
    queued = None
    for line in commands:
        queued = queue(root, session, line, selected["label"], provider=found["provider"], action=action, value=value)
    agents = Agents(Record(root, env), actor=SYSTEM)
    row = agents.by_session(session)
    agents.update(row.n, pending={**row.pending, action: {"value": value, "at": queued["at"]}})
    return {k: v for k, v in queued.items() if k != "line"} | {"queued": True}
