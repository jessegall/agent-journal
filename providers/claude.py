import json
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SUMMARY, SUPERSEDED, TASK, TOOL, Turn, timestamp
from providers.base import EVENTS, Provider

ASKS = frozenset({"AskUserQuestion"})


class Claude(Provider):
    name = "claude"

    def present(self, project: Path) -> bool:
        return (project / ".claude").is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.json"

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in EVENTS}}

    def compacted(self, payload: dict) -> bool:
        return payload.get("source") == "compact"

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
