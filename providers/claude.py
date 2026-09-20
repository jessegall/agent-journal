import json
import re
import shutil
import time
from datetime import datetime
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SUMMARY, SUPERSEDED, TASK, TOOL, Turn, timestamp
from engine.hooks import EVENTS
from providers.base import Provider
from providers.payload import Hook
from resources.types import AgentRow

ASKS = frozenset({"AskUserQuestion"})
WINDOW, LONG_WINDOW, LONG_MARK = 200_000, 1_000_000, "[1m]"
TAIL = 1_000_000
STATUS_SCRIPT = "claude-status.sh"
STATUS_HOME = (".journal", "claude-status")
PLAN_WINDOWS = {"five_hour": ("5h", 300), "seven_day": ("7d", 10080)}
NOTIFIED = re.compile(r"<tool-use-id>([^<]+)</tool-use-id>.*?<status>([^<]+)</status>", re.S)
DISPATCHES = ("Agent", "Task")
QUIET_SUBAGENT = 600


class Claude(Provider):
    name = "claude"
    question_tools = frozenset({"AskUserQuestion"})
    briefing_file = "CLAUDE.md"
    skill_home = ".claude/skills"
    link_skills = True
    at_once = ("effort",)
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

    def inbox(self, hook: Hook) -> str:
        return hook.inbox if hook.inbox and Path(hook.inbox).is_socket() else ""

    def setting(self, project: Path, key: str) -> str:
        found = ""
        for settings in (Path.home() / ".claude" / "settings.json", project / ".claude" / "settings.json", project / ".claude" / "settings.local.json"):
            try:
                found = json.loads(settings.read_text()).get(key) or found
            except (OSError, ValueError, AttributeError):
                continue
        return found

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return self.reported(transcript, "effort").get("level", "") or self.setting(project, "effortLevel")

    def reported(self, transcript: Path | None, key: str) -> dict:
        try:
            said = json.loads(Path.home().joinpath(*STATUS_HOME, f"{Path(transcript).stem}.json").read_text())
        except (OSError, ValueError, TypeError):
            return {}
        found = said.get(key)
        return found if isinstance(found, dict) else {}

    def window(self, hook: Hook, used: int) -> int:
        configured = self.setting(Path(hook.cwd or "."), "model")
        return LONG_WINDOW if LONG_MARK in f"{hook.model}{configured}" or used > WINDOW else WINDOW

    def wire(self, project: Path, command: str) -> Path:
        wired = super().wire(project, command)
        settings = self.settings(project)
        if "statusLine" not in settings:
            script = Path(command.split()[1]).with_name(STATUS_SCRIPT)
            self.save(project, {**settings, "statusLine": {"type": "command", "command": f"sh {script}", "padding": 0}})
        return wired

    def usage(self, path: Path, now: float | None = None) -> dict | None:
        limits = self.reported(path, "rate_limits")
        if not limits:
            return None
        windows = []
        for key, (label, minutes) in PLAN_WINDOWS.items():
            raw = limits.get(key)
            if not isinstance(raw, dict):
                continue
            try:
                used = float(raw.get("used_percentage"))
                resets = self.moment(raw.get("resets_at"))
            except (TypeError, ValueError):
                continue
            windows.append({"key": key, "label": label, "used": round(max(0, min(100, used)), 1), "minutes": minutes, "resets": resets})
        return {"windows": windows}

    def moment(self, value) -> int:
        if isinstance(value, (int, float)) or str(value).isdigit():
            return int(float(value))
        return int(datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp())

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
        for _, row in reversed(self.entries(path)):
            model = (row.get("message") or {}).get("model")
            if model:
                return model
        return hook.model

    def context(self, hook: Hook) -> float | None:
        path = hook.transcript
        if not path or not path.is_file():
            return None
        for _, row in reversed(self.entries(path)):
            usage = (row.get("message") or {}).get("usage")
            if usage:
                used = sum(int(usage.get(k) or 0) for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
                return round(100 * used / self.window(hook, used), 1)
        return None

    def turn(self, row: dict) -> tuple | None:
        if (row.get("isSidechain") and not row.get("agentId")) or row.get("type") not in ("user", "assistant"):
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
        return [{"id": b.get("id", ""), "name": b.get("name", ""), "input": b.get("input") or {}, "at": at} for b in content or () if isinstance(b, dict) and b.get("type") == "tool_use"]

    def endings(self, rows: list[dict]) -> dict[str, tuple[str, float]]:
        ended = {}
        for row in rows:
            at = timestamp(str(row.get("timestamp") or ""))
            if row.get("type") == "queue-operation" and row.get("operation") == "enqueue":
                for used, status in NOTIFIED.findall(str(row.get("content") or "")):
                    ended[used] = (status, at)
            if row.get("type") != "user" or row.get("isSidechain") or not isinstance((row.get("message") or {}).get("content"), list):
                continue
            for block in row["message"]["content"]:
                if isinstance(block, dict) and block.get("type") == "tool_result":
                    ended.setdefault(str(block.get("tool_use_id") or ""), ("returned", at))
        return ended

    def crew(self, path: Path) -> dict:
        rows = [row for _, row in self.entries(path)]
        uses = [use for row in rows for use in self.tool_uses(row)]
        ended = self.endings(rows)
        sessions = {}
        for meta in Path(path).with_suffix("").joinpath("subagents").glob("*.meta.json"):
            try:
                sessions[json.loads(meta.read_text()).get("toolUseId")] = meta.with_name(meta.name.replace(".meta.json", ".jsonl"))
            except (OSError, ValueError):
                continue
        now = time.time()
        subagents = []
        for use in (u for u in uses if u["name"] in DISPATCHES):
            given, session = use["input"], sessions.get(use["id"])
            status, done = ended.get(use["id"], ("", 0.0))
            waiting = bool(given.get("run_in_background")) and status == "returned"
            quiet = session is None or not session.is_file() or now - session.stat().st_mtime > QUIET_SUBAGENT
            running = (not status or waiting) and not (waiting and quiet)
            subagents.append({"id": use["id"], "task": str(given.get("description") or "subagent"), "type": str(given.get("subagent_type") or ""),
                              "model": str(given.get("model") or ""), "running": running, "at": use["at"], "ended": 0.0 if running else done,
                              "status": "" if running else status if status != "returned" or not given.get("run_in_background") else "stopped",
                              "session": session.stem.removeprefix("agent-") if session else ""})
        shells = []
        for use in (u for u in uses if u["name"] == "Bash" and u["input"].get("run_in_background")):
            status, done = ended.get(use["id"], ("", 0.0))
            finished = status not in ("", "returned")
            shells.append({"id": use["id"], "command": str(use["input"].get("command") or "")[:160], "task": str(use["input"].get("description") or ""),
                           "running": not finished, "at": use["at"], "ended": done if finished else 0.0, "status": status if finished else ""})
        skills = sorted({str(u["input"].get("skill") or "") for u in uses if u["name"] == "Skill"} - {""})
        return {AgentRow.skills: skills, AgentRow.shells: len(shells), AgentRow.subagents: len(subagents),
                AgentRow.shell_rows: shells, AgentRow.subagent_rows: subagents}

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        found = Path(path).with_suffix("").joinpath("subagents", f"agent-{session}.jsonl")
        return found if found.is_file() else None
