import json
import re
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, TOOL, timestamp
from engine.hooks import EVENTS
from providers.base import Provider
from providers.payload import Hook
from resources.types import AgentRow

TOOLS = {"exec": "Bash", "exec_command": "Bash", "shell": "Bash", "shell_command": "Bash", "apply_patch": "Edit"}
SKILL_PATH = re.compile(r"\.(?:codex|agents)/skills/(journal(?:-[\w-]+)?)/SKILL\.md")
SKILL_LOOP = re.compile(r"for\s+\w+\s+in\s+([^;]+);\s*do")
TAIL_BYTES = 262144
WINDOW_LABELS = {300: "5h", 1440: "1d", 10080: "7d"}


class Codex(Provider):
    name = "codex"
    question_tools = frozenset({"request_user_input"})
    briefing_file = "AGENTS.md"
    skill_home = ".agents/skills"
    retired_skill_homes = (".codex/skills",)
    controls = {
        "groups": [
            {
                "key": "picker",
                "label": "Model and reasoning effort",
                "choices": [{"value": "open", "label": "Open Codex picker", "command": "/model"}],
            },
        ],
        "note": "Choose the model and reasoning effort in the Codex terminal picker.",
    }
    usage_note = "Codex reports plan limits here after its next response."

    def present(self, project: Path) -> bool:
        return (project / ".codex").is_dir() or shutil.which("codex") is not None

    def config(self, project: Path) -> Path:
        return project / ".codex" / "hooks.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS}}

    def dispatch(self, tool) -> dict:
        if not tool.name.endswith("spawn_agent"):
            return {}
        return {"kind": tool.task_name.strip().lower(), "model": tool.model.strip(), "model_supported": True}

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
        for payload in self.token_counts(hook.transcript):
            try:
                info = payload.get("info") or {}
                usage = info.get("last_token_usage") or {}
                used = int(usage.get("total_tokens") or usage.get("input_tokens") or 0)
                window = int(info.get("model_context_window") or 0)
            except (TypeError, ValueError, AttributeError):
                continue
            if used and window:
                return round(100 * used / window, 1)
        return None

    def usage(self, path: Path, now: float | None = None) -> dict | None:
        for payload in self.token_counts(path):
            limits = payload.get("rate_limits") or payload.get("rateLimits")
            if isinstance(limits, dict):
                break
        else:
            return None
        windows = []
        for key in ("primary", "secondary"):
            raw = limits.get(key)
            if not isinstance(raw, dict):
                continue
            try:
                used = float(self.value(raw, "used_percent", "usedPercent"))
                minutes = int(self.value(raw, "window_minutes", "windowDurationMins"))
                resets = int(self.value(raw, "resets_at", "resetsAt"))
            except (TypeError, ValueError):
                continue
            windows.append({"key": key, "label": self.window_label(minutes), "used": round(max(0, min(100, used)), 1), "minutes": minutes, "resets": resets})
        return {"windows": windows}

    def token_counts(self, path: Path | None):
        for line in reversed(self.tail(path)):
            try:
                row = json.loads(line)
            except ValueError:
                continue
            payload = row.get("payload") or {}
            if row.get("type") == "event_msg" and payload.get("type") == "token_count":
                yield payload

    def tail(self, path: Path | None) -> list[str]:
        try:
            with Path(path).open("rb") as source:
                source.seek(0, 2)
                size = source.tell()
                start = max(0, size - TAIL_BYTES)
                source.seek(start)
                raw = source.read()
        except (OSError, TypeError):
            return []
        if start:
            raw = raw.split(b"\n", 1)[-1]
        return raw.decode(errors="replace").splitlines()

    def value(self, row: dict, snake: str, camel: str):
        return row.get(snake) if snake in row else row.get(camel)

    def window_label(self, minutes: int) -> str:
        if minutes in WINDOW_LABELS:
            return WINDOW_LABELS[minutes]
        if minutes and minutes % 1440 == 0:
            return f"{minutes // 1440}d"
        if minutes and minutes % 60 == 0:
            return f"{minutes // 60}h"
        return f"{minutes}m"

    def crew(self, path: Path) -> dict:
        uses = self.tools(path)
        skills = sorted({str((use.get("input") or {}).get("skill") or "") for use in uses if use.get("name") == "Skill"} - {""})
        subagents = sum(1 for use in uses if str(use.get("name") or "").endswith("spawn_agent"))
        subagent_rows = []
        shell_rows = []
        shells = 0
        compacting = False
        pending = {}
        try:
            lines = Path(path).read_text().splitlines()
        except OSError:
            lines = []
        for line in lines:
            try:
                row = json.loads(line)
                payload = row.get("payload") or {}
            except (ValueError, AttributeError):
                continue
            if row.get("type") == "response_item":
                name = ".".join(part for part in (str(payload.get("namespace") or ""), str(payload.get("name") or "")) if part)
                key = payload.get("call_id") or payload.get("id")
                raw = payload.get("arguments") or payload.get("input") or ""
                text = str(raw)
                if name.endswith("spawn_agent"):
                    try:
                        detail = json.loads(raw) if isinstance(raw, str) else raw
                    except (TypeError, ValueError):
                        detail = {}
                    detail = detail if isinstance(detail, dict) else {}
                    subagent_rows.append({"task": str(detail.get("task_name") or "subagent"), "model": str(detail.get("model") or "")})
                elif name.rsplit(".", 1)[-1] in ("exec", "exec_command", "shell", "shell_command"):
                    pending[key] = text
                if payload.get("type") == "custom_tool_call_output" and str(payload.get("output") or "").startswith("Script running with cell ID"):
                    shells += 1
                    command = pending.get(payload.get("call_id") or payload.get("id"), "")
                    shell_rows.append({"command": command[:160] or "background shell", "cell": str(payload.get("output") or "").split("ID", 1)[-1].strip()})
            if row.get("type") == "compacted":
                compacting = True
            elif row.get("type") == "response_item" and (payload.get("role") == "assistant" or payload.get("type") in ("reasoning", "function_call", "custom_tool_call")):
                compacting = False
        return {AgentRow.skills: skills, AgentRow.shells: shells, AgentRow.subagents: subagents,
                AgentRow.shell_rows: shell_rows, AgentRow.subagent_rows: subagent_rows, AgentRow.compacting: compacting}

    def session(self, path: Path | None) -> dict:
        try:
            with Path(path).open() as source:
                for line in source:
                    try:
                        row = json.loads(line)
                    except ValueError:
                        continue
                    if row.get("type") != "session_meta":
                        continue
                    payload = row.get("payload") or {}
                    spawn = ((payload.get("source") or {}).get("subagent") or {}).get("thread_spawn") or {}
                    return {AgentRow.parent: str(spawn.get("parent_thread_id") or "")}
        except (OSError, TypeError, AttributeError):
            pass
        return {}

    def tool_uses(self, row: dict) -> list[dict]:
        payload = row.get("payload") or {}
        if row.get("type") != "response_item" or payload.get("type") not in ("function_call", "custom_tool_call"):
            return []
        name = ".".join(part for part in (str(payload.get("namespace") or ""), str(payload.get("name") or "")) if part)
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
