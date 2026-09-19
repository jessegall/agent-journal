from pathlib import Path

from engine.inputs import queue
from engine.seats import live
from resources.base import Refused

PROVIDERS = {
    "claude": {
        "groups": [
            {
                "key": "model",
                "label": "Model",
                "choices": [
                    {"value": "opus", "label": "Opus", "command": "/model opus"},
                    {"value": "sonnet", "label": "Sonnet", "command": "/model sonnet"},
                    {"value": "haiku", "label": "Haiku", "command": "/model haiku"},
                ],
            },
            {
                "key": "effort",
                "label": "Reasoning effort",
                "choices": [
                    {"value": "auto", "label": "Auto", "command": "/effort auto"},
                    {"value": "low", "label": "Low", "command": "/effort low"},
                    {"value": "medium", "label": "Medium", "command": "/effort medium"},
                    {"value": "high", "label": "High", "command": "/effort high"},
                    {"value": "xhigh", "label": "Extra high", "command": "/effort xhigh"},
                    {"value": "max", "label": "Maximum", "command": "/effort max"},
                ],
            },
        ],
        "note": "Changes apply immediately to this Claude Code session.",
    },
    "codex": {
        "groups": [
            {
                "key": "picker",
                "label": "Model and reasoning effort",
                "choices": [
                    {"value": "open", "label": "Open Codex picker", "command": "/model"},
                ],
            },
        ],
        "note": "Choose the model and reasoning effort in the Codex terminal picker.",
    },
}


def options(provider: str) -> dict:
    configured = PROVIDERS.get(provider)
    if not configured:
        return {"provider": provider, "groups": [], "note": "This CLI does not expose model controls."}
    return {
        "provider": provider,
        "groups": [
            {**group, "choices": [{k: v for k, v in choice.items() if k != "command"} for choice in group["choices"]]}
            for group in configured["groups"]
        ],
        "note": configured["note"],
    }


def choice(provider: str, action: str, value: str) -> dict:
    configured = PROVIDERS.get(provider) or {}
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
