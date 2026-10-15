import json
import shlex
from pathlib import Path

from journal.providers.provider import Provider


TAIL = 400_000
"""How much of the transcript's end is read for the thoughts of one turn."""


class Claude(Provider):
    name = "claude"
    home = ".claude"
    settings_file = "settings.json"
    write_tools = frozenset({"Write", "Edit", "MultiEdit", "NotebookEdit"})
    read_tool = "Read"
    controls = {
        "groups": [
            {"key": "model", "label": "Model", "choices": [{"value": v, "label": l, "command": f"/model {v}"} for v, l in (("opus", "Opus"), ("sonnet", "Sonnet"), ("haiku", "Haiku"), ("fable", "Fable"))]},
            {"key": "effort", "label": "Reasoning effort", "choices": [{"value": v, "label": l, "command": f"/effort {v}"} for v, l in (("low", "Low"), ("medium", "Medium"), ("high", "High"), ("xhigh", "Extra high"), ("max", "Maximum"))]},
            {"key": "context", "label": "Context window", "choices": [{"value": "compact", "label": "Compact context", "command": "/compact"}, {"value": "clear", "label": "Clear context", "command": "/clear"}]},
        ],
        "note": "Changes apply at once to this Claude Code session.",
    }

    def transcript(self, project: Path, session: str) -> Path | None:
        path = Path.home() / ".claude" / "projects" / self.folder_name(project) / f"{session}.jsonl"
        return path if path.is_file() else None

    def thoughts_this_turn(self, project: Path, session: str) -> list[str]:
        """The thinking blocks after the last prompt, read from the transcript's tail."""
        path = self.transcript(project, session)
        if path is None:
            return []
        with path.open("rb") as file:
            start = max(0, path.stat().st_size - TAIL)
            file.seek(start)
            lines = file.read().decode(errors="replace").splitlines()[1 if start else 0:]
        rows = [json.loads(line) for line in lines if line.startswith("{")]
        thoughts: list[str] = []
        for row in rows:
            content = row.get("message", {}).get("content", [])
            if row.get("type") == "user" and not any(isinstance(b, dict) and b.get("type") == "tool_result" for b in content):
                thoughts = []
            elif row.get("type") == "assistant":
                thoughts += [b["thinking"] for b in content if isinstance(b, dict) and b.get("type") == "thinking"]
        return thoughts

    def resume(self, session: str) -> tuple[str, ...]:
        return ("--resume", session)

    def worker_command(self, brief: str, model: str) -> list[str]:
        return ["claude", "-p", brief, "--model", model, "--dangerously-skip-permissions"]

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        path = super().wire_hooks(project, script, command)
        settings = json.loads(path.read_text())
        status = shlex.join(["sh", str(script.with_name("status.sh"))])
        if settings.get("statusLine", {}).get("command") != status:
            settings["statusLine"] = {"type": "command", "command": status, "padding": 0}
            path.write_text(json.dumps(settings, indent=2) + "\n")
        return path
