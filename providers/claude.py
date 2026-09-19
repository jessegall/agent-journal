import json
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SUMMARY, SUPERSEDED, TASK, TOOL, Turn, timestamp
from engine.hooks import EVENTS
from providers.base import Provider
from providers.payload import Hook

ASKS = frozenset({"AskUserQuestion"})
WINDOW, LONG_WINDOW, LONG_MARK = 200_000, 1_000_000, "[1m]"


class Claude(Provider):
    name = "claude"
    question_tools = frozenset({"AskUserQuestion"})
    briefing_file = "CLAUDE.md"
    skill_home = ".claude/skills"
    link_skills = True
    controls = {
        "groups": [
            {
                "key": "model",
                "label": "Model",
                "choices": [
                    {"value": "opus", "label": "Opus", "command": "/model opus"},
                    {"value": "sonnet", "label": "Sonnet", "command": "/model sonnet"},
                    {"value": "haiku", "label": "Haiku", "command": "/model haiku"},
                    {"value": "claude-fable-5-1", "label": "Fable", "command": "/model claude-fable-5-1"},
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
    }
    usage_note = "Claude exposes plan limits only in its native /usage view; the journal does not replace your status-line configuration to scrape them."

    def setting(self, project: Path, key: str) -> str:
        found = ""
        for settings in (Path.home() / ".claude" / "settings.json", project / ".claude" / "settings.json", project / ".claude" / "settings.local.json"):
            try:
                found = json.loads(settings.read_text()).get(key) or found
            except (OSError, ValueError, AttributeError):
                continue
        return found

    def effort(self, project: Path) -> str:
        return self.setting(project, "effortLevel")

    def window(self, hook: Hook, used: int) -> int:
        configured = self.setting(Path(hook.cwd or "."), "model")
        return LONG_WINDOW if LONG_MARK in f"{hook.model}{configured}" or used > WINDOW else WINDOW

    def present(self, project: Path) -> bool:
        return (project / ".claude").is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in EVENTS}}

    def compacted(self, hook: Hook) -> bool:
        return hook.source == "compact"

    def dispatch(self, tool) -> dict:
        if tool.name != "Agent":
            return {}
        kind = tool.subagent_type.strip().lower()
        return {"kind": kind, "model": tool.model.strip(), "model_supported": kind != "fork"}

    def model(self, hook: Hook) -> str:
        path = hook.transcript
        if not path or not path.is_file():
            return hook.model
        for raw in reversed(path.read_text().splitlines()):
            try:
                model = json.loads(raw).get("message", {}).get("model")
            except (ValueError, AttributeError):
                continue
            if model:
                return model
        return hook.model

    def context(self, hook: Hook) -> float | None:
        path = hook.transcript
        if not path or not path.is_file():
            return None
        for raw in reversed(path.read_text().splitlines()):
            try:
                usage = json.loads(raw).get("message", {}).get("usage")
            except (ValueError, AttributeError):
                continue
            if usage:
                used = sum(int(usage.get(k) or 0) for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
                return round(100 * used / self.window(hook, used), 1)
        return None

    def turn(self, row: dict) -> tuple | None:
        if row.get("isSidechain") or row.get("type") not in ("user", "assistant"):
            return None
        content = (row.get("message") or {}).get("content")
        blocks = [block for block in (content if isinstance(content, list) else []) if isinstance(block, dict)]
        text = content if isinstance(content, str) else "\n".join(self.block_text(block) for block in blocks if block.get("type") == "text")
        results = [b for b in blocks if b.get("type") == "tool_result"]
        if results and not text.strip():
            text = "\n".join(self.result_text(b) for b in results)
        uses = [block for block in blocks if block.get("type") == "tool_use"]
        questions = [self.question_text(block.get("input") or {}) for block in uses if block.get("name") in ASKS]
        if questions:
            text = "\n".join(part for part in (text, *questions) if part)
        tools = [f"Skill:{(b.get('input') or {}).get('skill', '')}" if b.get("name") == "Skill" else str(b.get("name") or "") for b in uses]
        if not text.strip() and not tools:
            return None
        kind = self.kind(row, bool(results))
        who = SUMMARY if kind == SUMMARY else "user" if kind == HUMAN else "agent" if kind == AGENT else kind
        asked = [str(block.get("id") or "") for block in uses if block.get("name") in ASKS]
        answered = [str(block.get("tool_use_id") or "") for block in results]
        return who, text, kind, timestamp(str(row.get("timestamp") or "")), tools, str(row.get("parentUuid") or ""), asked, answered

    def block_text(self, block: dict) -> str:
        return str(block.get("text") or "")

    def result_text(self, block: dict) -> str:
        got = block.get("content")
        return got if isinstance(got, str) else "\n".join(self.block_text(b) for b in got or () if isinstance(b, dict))

    def question_text(self, data: dict) -> str:
        out = []
        for question in data.get("questions") or []:
            if not isinstance(question, dict):
                continue
            text = str(question.get("question") or "").strip()
            options = [str(option.get("label") or "") for option in question.get("options") or [] if isinstance(option, dict)]
            if options:
                text = f"{text}  [{' / '.join(option for option in options if option)}]"
            if text:
                out.append(f"asked: {text}")
        return "\n".join(out)

    def kind(self, row: dict, has_result: bool) -> str:
        if row.get("isCompactSummary"):
            return SUMMARY
        if row["type"] == "assistant":
            return AGENT
        origin = (row.get("origin") or {}).get("kind")
        return PEER if origin == "peer" else TASK if origin == "task-notification" else TOOL if has_result else INJECTED if row.get("isMeta") else HUMAN

    def refine(self, turns: list[Turn]) -> list[Turn]:
        asked = set()
        for i, turn in enumerate(turns):
            asked.update(turn.asked)
            if turn.kind == TOOL and asked.intersection(turn.answered):
                turn.kind = HUMAN
                turn.who = "user"
            if turn.kind != HUMAN or not turn.parent:
                continue
            for previous in reversed(turns[:i]):
                if previous.kind == AGENT and previous.text.strip():
                    break
                if previous.kind == HUMAN and previous.parent == turn.parent:
                    previous.kind = SUPERSEDED
                    break
        return turns

    def tool_uses(self, row: dict) -> list[dict]:
        if row.get("type") != "assistant" or row.get("isSidechain"):
            return []
        content = (row.get("message") or {}).get("content")
        at = timestamp(str(row.get("timestamp") or ""))
        return [{"name": b.get("name", ""), "input": b.get("input") or {}, "at": at} for b in content or () if isinstance(b, dict) and b.get("type") == "tool_use"]
