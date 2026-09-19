from pathlib import Path

from engine.inputs import queue
from engine.seats import live
from providers import PROVIDERS
from resources.base import Refused


def options(provider: str) -> dict:
    cls = PROVIDERS.get(provider)
    configured = cls.controls if cls else {"groups": [], "note": "This CLI does not expose model controls."}
    return {
        "provider": provider,
        "groups": [
            {**group, "choices": [{k: v for k, v in choice.items() if k != "command"} for choice in group["choices"]]}
            for group in configured["groups"]
        ],
        "note": configured["note"],
    }


def choice(provider: str, action: str, value: str) -> dict:
    cls = PROVIDERS.get(provider)
    configured = cls.controls if cls else {}
    group = next((group for group in configured.get("groups", []) if group["key"] == action), None)
    selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
    if not selected:
        raise Refused(f"{provider or 'this agent'} does not support {action} {value!r}")
    return {"action": action, **selected}


def request(root: Path, env: str, session: str, action: str, value: str) -> dict:
    root = Path(root)
    found = next((agent for _, agent in live(root) if agent["session"] == session), None)
    if not found:
        raise Refused(f"session {session!r} is not online")
    if found["environment"] != env:
        raise Refused(f"session {session!r} belongs to environment {found['environment']!r}")
    selected = choice(found["provider"], action, value)
    queued = queue(root, session, selected["command"], selected["label"], provider=found["provider"], action=action, value=value)
    return {k: v for k, v in queued.items() if k != "line"} | {"queued": True}
