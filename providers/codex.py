import json
import re
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, TOOL, timestamp
from providers.base import EVENTS, Provider
from providers.payload import Hook
from resources.types import AgentRow

TOOLS = {"exec": "Bash", "exec_command": "Bash", "shell": "Bash", "shell_command": "Bash", "apply_patch": "Edit"}
SKILL_PATH = re.compile(r"\.(?:codex|agents)/skills/(journal(?:-[\w-]+)?)/SKILL\.md")
SKILL_LOOP = re.compile(r"for\s+\w+\s+in\s+([^;]+);\s*do")


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
        if row.get("type") != "response_item":
            return None
        kind = payload.get("type")
        at = timestamp(str(row.get("timestamp") or ""))
        if kind == "message":
            text = self.content_text(payload.get("content"))
            role = payload.get("role")
            if not text.strip() or role not in ("user", "assistant"):
                return None
            turn_kind = AGENT if role == "assistant" else INJECTED if text.lstrip().startswith("<") else HUMAN
            return "agent" if role == "assistant" else "user", text, turn_kind, at, []
        if kind in ("function_call", "custom_tool_call"):
            tool = TOOLS.get(str(payload.get("name") or ""), str(payload.get("name") or "?"))
            return "agent", "", AGENT, at, [tool]
        if kind in ("function_call_output", "custom_tool_call_output"):
            return TOOL, self.content_text(payload.get("output")), TOOL, at, []
        return None

    def content_text(self, content) -> str:
        if isinstance(content, str):
            return content
        return "\n".join(str(block.get("text") or "") for block in content or [] if isinstance(block, dict) and block.get("type") in ("input_text", "output_text", "text"))

    def context(self, hook: Hook) -> float | None:
        try:
            rows = reversed(hook.transcript.read_text().splitlines())
        except (OSError, AttributeError):
            return None
        for raw in rows:
            try:
                row = json.loads(raw)
                item = row.get("payload") or {}
                info = item.get("info") or {}
                usage = info.get("last_token_usage") or {}
                used = int(usage.get("total_tokens") or usage.get("input_tokens") or 0)
                window = int(info.get("model_context_window") or 0)
            except (ValueError, TypeError, AttributeError):
                continue
            if row.get("type") == "event_msg" and item.get("type") == "token_count" and used and window:
                return round(100 * used / window, 1)
        return None

    def telemetry(self, row, hook: Hook) -> dict:
        if hook.event == "SubagentStart":
            return {AgentRow.subagents: int(row.subagents or 0) + 1}
        if hook.event == "PostToolUse" and hook.tool.name == "Bash" and hook.tool.response.get("session_id") is not None:
            return {AgentRow.shells: int(row.shells or 0) + 1}
        return {}

    def crew(self, path: Path) -> dict:
        return {AgentRow.skills: super().crew(path)[AgentRow.skills]}

    def tool_uses(self, row: dict) -> list[dict]:
        payload = row.get("payload") or {}
        if row.get("type") != "response_item" or payload.get("type") not in ("function_call", "custom_tool_call"):
            return []
        name = str(payload.get("name") or "")
        raw = payload.get("arguments") or payload.get("input") or ""
        data = raw if isinstance(raw, dict) else {"raw": str(raw)}
        at = timestamp(str(row.get("timestamp") or ""))
        uses = [{"name": name, "input": data, "at": at}]
        text = str(raw)
        if "tools.exec_command" not in text:
            return uses
        found = set(SKILL_PATH.findall(text))
        if "/skills/$s/SKILL.md" in text:
            loop = SKILL_LOOP.search(text)
            if loop:
                found.update(word for word in loop.group(1).split() if word == "journal" or word.startswith("journal-"))
        return uses + [{"name": "Skill", "input": {"skill": skill}, "at": at} for skill in sorted(found)]
