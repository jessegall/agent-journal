import json
import shlex
from pathlib import Path

from journal.providers.provider import Provider
from journal.providers.turn import Turn


TAIL = 400_000
"""How much of the transcript's end is read for the thoughts of one turn."""


class Claude(Provider):
    name = "claude"
    home = ".claude"
    settings_file = "settings.json"
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

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        path = Path.home() / ".claude" / "projects" / self.folder_name(project) / parent / "subagents" / f"agent-{agent_id}.jsonl"
        return path if path.is_file() else None

    def turns(self, path: Path) -> list[Turn]:
        return [turn for number, row in self.json_lines(path) if (turn := self.turn(number, row))]

    def turn(self, number: int, row: dict) -> Turn | None:
        if row.get("type") not in ("user", "assistant"):
            return None
        content = row.get("message", {}).get("content", [])
        blocks = [{"type": "text", "text": content}] if isinstance(content, str) else [b for b in content if isinstance(b, dict)]
        text = "\n".join(b.get("text", "") for b in blocks if b.get("type") == "text")
        results = [b for b in blocks if b.get("type") == "tool_result"]
        if results and not text.strip():
            text = "\n".join(self.result_text(b.get("content", "")) for b in results)
        tools = [b.get("name", "") for b in blocks if b.get("type") == "tool_use"]
        if not text.strip() and not tools:
            return None
        kind = "summary" if row.get("isCompactSummary") else "agent" if row["type"] == "assistant" else "tool" if results else "injected" if row.get("isMeta") else "human"
        return Turn(number, "user" if kind in ("human", "injected") else kind, kind, text, self.seconds(row.get("timestamp", "")), tools)

    @staticmethod
    def result_text(content) -> str:
        return content if isinstance(content, str) else "\n".join(b.get("text", "") for b in content if isinstance(b, dict))

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

    def texts_written(self, project: Path, session: str, read: int) -> tuple[list[str], int]:
        """Every text block of an assistant row written since the byte read last, whole lines only; the first look at a transcript starts at its last line, the turn in hand, so a session's past is not replayed but the block that brought the hook is."""
        path = self.transcript(project, session)
        if path is None:
            return [], read
        size = path.stat().st_size
        if read > size:
            return [], size
        if read < 0:
            read = self.last_line_start(path, size)
        with path.open("rb") as file:
            file.seek(read)
            raw = file.read()
        whole = raw.rfind(b"\n") + 1
        rows = [json.loads(line) for line in raw[:whole].decode(errors="replace").splitlines() if line.startswith("{")]
        texts = [block["text"] for row in rows if row.get("type") == "assistant" for block in row.get("message", {}).get("content", []) if isinstance(block, dict) and block.get("type") == "text" and block.get("text", "").strip()]
        return texts, read + whole

    @staticmethod
    def last_line_start(path: Path, size: int) -> int:
        """The byte the transcript's last line begins at."""
        with path.open("rb") as file:
            file.seek(max(0, size - TAIL))
            tail = file.read()
        body = tail[:-1] if tail.endswith(b"\n") else tail
        cut = body.rfind(b"\n")
        return max(0, size - TAIL) + cut + 1 if cut != -1 else max(0, size - TAIL)

    def resume(self, session: str) -> tuple[str, ...]:
        return ("--resume", session)

    def worker_command(self, brief: str, model: str, resume: str = "") -> list[str]:
        resumed = ["--resume", resume] if resume else []
        return ["claude", "-p", brief, "--model", model, "--dangerously-skip-permissions", "--output-format", "json", *resumed]

    def worker_outcome(self, out: str, err: str) -> tuple[str, str]:
        """Claude's JSON answer: the result is the report and the session id is what a next job resumes; anything else is the report as printed."""
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
