from __future__ import annotations

import json
import os
from pathlib import Path

#: the record types a Codex rollout file is made of — none of which a Claude transcript has
TYPES = frozenset({"session_meta", "turn_context", "event_msg", "response_item"})
#: Codex's tool names, as the journal's hooks see them: what its PreToolUse payload calls the same call
TOOLS = {"exec_command": "Bash", "shell": "Bash", "shell_command": "Bash", "apply_patch": "Edit"}


def is_rollout(path: Path | None) -> bool:
    return path is not None and path.name.startswith("rollout-")


def sessions_dir() -> Path:
    return Path(os.environ.get("CODEX_HOME") or (Path.home() / ".codex")) / "sessions"


def find(stem: str) -> Path | None:
    if not stem.startswith("rollout-"):
        return None
    root = sessions_dir()
    if not root.is_dir():
        return None
    for f in root.glob(f"*/*/*/{stem}.jsonl"):
        if f.is_file():
            return f
    return None


def line_of(rec: dict, n: int):
    from transcript import Line
    typ = rec.get("type")
    if typ != "response_item":
        return None
    p = rec.get("payload") or {}
    kind = p.get("type")
    ts = rec.get("timestamp", "")
    if kind == "message":
        text = "\n".join(str(b.get("text", "")) for b in p.get("content") or [] if isinstance(b, dict))
        role = p.get("role", "")
        if role == "assistant":
            return Line(n=n, role="assistant", kind="text", text=text, ts=ts)
        if role == "user":
            # what the user typed is theirs; a tagged block (<environment_context>, <hook_prompt>) is the harness's
            injected = text.lstrip().startswith("<")
            return Line(n=n, role="user", kind="injected" if injected else "human", text=text, ts=ts)
        return Line(n=n, role="user", kind="injected", text=text, ts=ts)
    if kind == "function_call":
        name = str(p.get("name") or "?")
        tool = TOOLS.get(name, name)
        return Line(n=n, role="assistant", kind="text", text="", ts=ts, tools=[tool])
    if kind == "function_call_output":
        return Line(n=n, role="user", kind="tool_result", text=str(p.get("output") or ""), ts=ts)
    return None


def usage_of(raw: bytes) -> int | None:
    if b'"token_count"' not in raw:
        return None
    try:
        rec = json.loads(raw)
    except ValueError:
        return None
    if rec.get("type") != "event_msg":
        return None
    info = ((rec.get("payload") or {}).get("info") or {})
    last = info.get("last_token_usage") or {}
    if not last:
        return None
    return int(last.get("input_tokens") or 0)


def window_of(path: Path, limit: int = 300_000) -> int:
    for raw in _tail(path, limit):
        if b'"model_context_window"' not in raw:
            continue
        try:
            rec = json.loads(raw)
        except ValueError:
            continue
        p = rec.get("payload") or {}
        got = (p.get("info") or {}).get("model_context_window") or p.get("model_context_window")
        if got:
            return int(got)
    return 0


def last_model(path: Path, limit: int = 300_000) -> str:
    model = ""
    for raw in _tail(path, limit):
        if b'"turn_context"' not in raw:
            continue
        try:
            rec = json.loads(raw)
        except ValueError:
            continue
        if rec.get("type") == "turn_context":
            model = str((rec.get("payload") or {}).get("model") or model)
    return model


def _tail(path: Path, limit: int) -> list[bytes]:
    if not path.is_file():
        return []
    size = path.stat().st_size
    with path.open("rb") as fh:
        if size > limit:
            fh.seek(size - limit)
            fh.readline()
        return fh.read().splitlines()
