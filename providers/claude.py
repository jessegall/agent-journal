import json
import shutil
from pathlib import Path

from providers.base import EVENTS, Provider


class Claude(Provider):
    name = "claude"

    def present(self, project: Path) -> bool:
        return (project / ".claude").is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in EVENTS}}

    def model(self, payload: dict) -> str:
        path = Path(str(payload.get("transcript_path") or ""))
        if not path.is_file():
            return str(payload.get("model") or "")
        for raw in reversed(path.read_text().splitlines()):
            try:
                model = json.loads(raw).get("message", {}).get("model")
            except (ValueError, AttributeError):
                continue
            if model:
                return model
        return str(payload.get("model") or "")

    def context(self, payload: dict) -> float | None:
        path = Path(str(payload.get("transcript_path") or ""))
        if not path.is_file():
            return None
        for raw in reversed(path.read_text().splitlines()):
            try:
                usage = json.loads(raw).get("message", {}).get("usage")
            except (ValueError, AttributeError):
                continue
            if usage:
                used = sum(int(usage.get(k) or 0) for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
                window = 1_000_000 if "[1m]" in str(payload.get("model") or "") or used > 200_000 else 200_000
                return round(100 * used / window, 1)
        return None

    def turn(self, row: dict) -> tuple[str, str] | None:
        if row.get("isSidechain") or row.get("type") not in ("user", "assistant"):
            return None
        content = (row.get("message") or {}).get("content")
        text = content if isinstance(content, str) else "\n".join(b.get("text", "") for b in content or () if isinstance(b, dict) and b.get("type") == "text")
        if not text.strip():
            return None
        if row.get("isCompactSummary"):
            return "summary", text
        return ("user" if row["type"] == "user" else "agent"), text
