import shutil
from pathlib import Path

from providers.base import EVENTS, Provider


class Codex(Provider):
    name = "codex"

    def present(self, project: Path) -> bool:
        return (project / ".codex").is_dir() or shutil.which("codex") is not None

    def config(self, project: Path) -> Path:
        return project / ".codex" / "hooks.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS}}

    def turn(self, row: dict) -> tuple[str, str] | None:
        payload = row.get("payload") or {}
        if row.get("type") != "event_msg" or payload.get("type") not in ("user_message", "agent_message"):
            return None
        text = str(payload.get("message") or "")
        return ("user" if payload["type"] == "user_message" else "agent", text) if text.strip() else None

    def tool_uses(self, row: dict) -> list[dict]:
        payload = row.get("payload") or {}
        if row.get("type") != "response_item" or payload.get("type") != "function_call":
            return []
        return [{"name": str(payload.get("name") or ""), "input": {}}]
