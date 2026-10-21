import json
import re
import shlex
from pathlib import Path
from typing import Iterator

from journal.events.agent.message_crossed import MessageCrossed
from journal.providers.support.claude_row import ClaudeRow
from journal.providers.provider import TAIL, Provider
from journal.providers.support.turn import Turn

CROSS_SESSION = re.compile(r"^<cross-session-message\s+([^>]*)>(.*?)</cross-session-message>$", re.S)
SENDER_NAME_PATTERN, SENDER_ADDRESS_PATTERN = re.compile(r'\bfrom-name="([^"]*)"'), re.compile(r'\bfrom="([^"]*)"')


class Claude(Provider):
    name = "claude"
    skip_prompts = ("--dangerously-skip-permissions",)
    home = ".claude"
    settings_file = "settings.json"
    other_settings = ("settings.local.json",)
    write_tools = frozenset({"Write", "Edit", "MultiEdit", "NotebookEdit"})
    read_tool = "Read"
    settings_extras = {"enableAllProjectMcpServers": True}
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

    def latest_session(self, project: Path, since: float) -> str:
        folder = Path.home() / ".claude" / "projects" / self.folder_name(project)
        written = [path for path in folder.glob("*.jsonl") if path.stat().st_mtime >= since] if folder.is_dir() else []
        return max(written, key=lambda path: path.stat().st_mtime).stem if written else ""

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        path = Path.home() / ".claude" / "projects" / self.folder_name(project) / parent / "subagents" / f"agent-{agent_id}.jsonl"
        return path if path.is_file() else None

    def turns_in(self, rows: Iterator[tuple[int, dict]]) -> list[Turn]:
        return [turn for number, row in rows if (turn := self.turn(number, ClaudeRow.from_json(row)))]

    def turn(self, number: int, row: ClaudeRow) -> Turn | None:
        if row.type not in ("user", "assistant"):
            return None
        text = "\n".join(b.text for b in row.of_type("text"))
        results = row.of_type("tool_result")
        if results and not text.strip():
            text = "\n".join(b.result for b in results)
        tools = [b.name for b in row.of_type("tool_use")]
        if not text.strip() and not tools:
            return None
        kind = row.kind
        return Turn(number, "user" if kind in ("human", "injected") else kind, kind, self.seconds(row.timestamp), text, tools)

    def thoughts_this_turn(self, project: Path, session: str) -> list[str]:
        path = self.transcript(project, session)
        if path is None:
            return []
        with path.open("rb") as file:
            start = max(0, path.stat().st_size - TAIL)
            file.seek(start)
            lines = file.read().decode(errors="replace").splitlines()[1 if start else 0:]
        thoughts: list[str] = []
        for row in (ClaudeRow.from_json(json.loads(line)) for line in lines if line.startswith("{")):
            if row.is_prompt:
                thoughts = []
            elif row.type == "assistant":
                thoughts += [b.thinking for b in row.of_type("thinking")]
        return thoughts

    def texts_in(self, line: dict) -> list[str]:
        row = ClaudeRow.from_json(line)
        return [block.text for block in row.of_type("text") if block.text.strip()] if row.type == "assistant" else []

    def crossed_in(self, line: dict) -> list[MessageCrossed]:
        row = ClaudeRow.from_json(line)
        if not row.is_enqueued:
            return []
        crossed = CROSS_SESSION.match(row.queued.strip())
        if crossed is None:
            return []
        named = SENDER_NAME_PATTERN.search(crossed[1]) or SENDER_ADDRESS_PATTERN.search(crossed[1])
        return [MessageCrossed(sender=named[1] if named else "another session", text=crossed[2].strip())]

    def resume(self, session: str) -> tuple[str, ...]:
        return ("--resume", session)

    def worker_command(self, brief: str, model: str, resume: str) -> list[str]:
        resumed = ["--resume", resume] if resume else []
        return ["claude", "-p", brief, "--model", model, "--dangerously-skip-permissions", "--output-format", "json", *resumed]

    def worker_outcome(self, out: str, err: str) -> tuple[str, str]:
        try:
            answer = json.loads(out)
        except ValueError:
            return out.strip() or err.strip(), ""
        return str(answer.get("result", "")).strip() or err.strip(), str(answer.get("session_id", ""))

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        path = super().wire_hooks(project, script, command)
        settings = json.loads(path.read_text())
        status = shlex.join(["sh", str(script.with_name("status.sh"))])
        if settings.get("statusLine", {}).get("command") != status:
            settings["statusLine"] = {"type": "command", "command": status, "padding": 0}
            path.write_text(json.dumps(settings, indent=2) + "\n")
        return path
