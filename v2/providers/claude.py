import json
import shutil
from pathlib import Path

from v2.providers.base import EVENTS, Provider


class Claude(Provider):
    name = "claude"

    def present(self, project: Path) -> bool:
        return (project / ".claude").is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in EVENTS}}

    def context(self, payload: dict) -> float | None:
        path = Path(str(payload.get("transcript_path") or ""))
        if not path.is_file():
            return None
        window = 1_000_000 if "[1m]" in str(payload.get("model") or "") else 200_000
        for raw in reversed(path.read_text().splitlines()):
            try:
                usage = json.loads(raw).get("message", {}).get("usage")
            except (ValueError, AttributeError):
                continue
            if usage:
                used = sum(int(usage.get(k) or 0) for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
                return round(100 * used / window, 1)
        return None
