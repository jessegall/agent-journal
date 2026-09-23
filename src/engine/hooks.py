import re
from dataclasses import dataclass
import threading
from pathlib import Path

from controllers.types import Agents, Environments
from engine.actors import IDLE
from engine.record import Record
from engine.sessions import Sessions, agent_pid, alive
from engine.worktree import checkout
from resources.base import AGENT, SYSTEM
from engine import chat, runtime
from engine.stored import read_json, write_json
from providers.payload import PERMISSION, STATUS
from features.status_bar import commands
from engine.fields import text_of, whole_of

POLICIES: list = []
CANCELERS: dict[str, list] = {}
DISPATCHING, LONG_COMMAND = "agent.dispatching", "agent.command.long"
CANCELABLE = (DISPATCHING, LONG_COMMAND)


def cancelled(name: str, provider, record, hook, session: str, data: dict) -> str:
    reasons = [reason for cancel in CANCELERS.get(name, []) if (reason := cancel(provider, record, hook, session, data))]
    return "; ".join(reasons)


def gated(provider, record, hook, session: str) -> str:
    dispatch = provider.dispatch(hook.tool)
    reason = cancelled(DISPATCHING, provider, record, hook, session, dispatch) if dispatch else ""
    return reason or next((reason for policy in POLICIES if serving(policy, provider, hook) and (reason := policy(provider, record, hook, session))), "")


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return root / "runtime" / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return runtime.session_file(root, session, f"gate-{env}.json")


JOURNAL = re.compile(r"(?:\A|[|;&\n]|\$\()[ \t]*(journal[ \t]+[^|;&\n]+)")


def serving(policy, provider, hook) -> bool:
    feature = getattr(policy, "feature", None)
    return not feature or feature.runs_for_subagents or not provider.is_subagent(hook)


def alongside(hook) -> str:
    ran = [found.group(1).strip() for found in JOURNAL.finditer(hook.command)]
    return f" — and these were on the same line, so they did not run either: {'; '.join(ran)}" if ran else ""


def start(root: Path, env: str, compacted: bool) -> str:
    path = start_file(root, env, compacted)
    return path.read_text() if path.is_file() else ""


SHOWING = threading.Lock()
DONE = "_done"
KEPT_DONE = 50
REPLAYING = threading.Lock()


def unsent(root: Path) -> Path:
    return runtime.folder(root) / "unsent"


def replay(root: Path) -> None:
    with REPLAYING:
        for f in sorted(unsent(root).glob("*.json"), key=lambda f: (f.stat().st_mtime_ns, f.name)):
            raw = read_json(f, None)
            f.unlink(missing_ok=True)
            if isinstance(raw, dict):
                display_chunk(root, raw)


def displayed(root: Path, raw: dict) -> None:
    replay(root)
    display_chunk(root, raw)


@dataclass(frozen=True)
class Chunk:
    session: str
    message: str
    index: int
    delta: str
    final: bool

    @classmethod
    def from_payload(cls, raw: dict) -> "Chunk":
        return cls(text_of(raw, "session_id"), text_of(raw, "message_id"), whole_of(raw, "index"), text_of(raw, "delta"), bool(raw.get("final")))


def display_chunk(root: Path, raw: dict) -> None:
    chunk = Chunk.from_payload(raw)
    session, message = chunk.session, chunk.message
    f = runtime.session_file(root, session, "displayed.json")
    with SHOWING:
        held = read_json(f, {})
        if message in held.get(DONE, []):
            return
        parts = {**held.get(message, {}), str(chunk.index): chunk.delta}
        rest = {key: value for key, value in held.items() if key != message}
        if not chunk.final:
            write_json(f, {**rest, message: parts})
            return
        write_json(f, {**rest, DONE: [*rest.get(DONE, []), message][-KEPT_DONE:]})
    send_to_chat(root, session, "".join(parts[i] for i in sorted(parts, key=int)))


def stopped(root: Path, session: str, text: str) -> None:
    f = runtime.session_file(root, session, "displayed.json")
    with SHOWING:
        held = read_json(f, {})
        cut = [message for message, parts in held.items() if message != DONE
               and "".join(parts[i] for i in sorted(parts, key=int)).strip() and text.strip().startswith("".join(parts[i] for i in sorted(parts, key=int)).strip())]
        if not cut:
            return
        write_json(f, {**{key: value for key, value in held.items() if key not in cut}, DONE: [*held.get(DONE, []), *cut][-KEPT_DONE:]})
    send_to_chat(root, session, text)


def send_to_chat(root: Path, session: str, text: str) -> None:
    record = Record(root, Sessions(root).environment(session) or runtime.env(root))
    row = Agents(record, actor=SYSTEM)._titled(session)
    if row and text.strip():
        chat.send(record, row, text)


def default_env(root: Path, prefer: str = "") -> str:
    return prefer or runtime.env(root)


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> dict:
    from providers.payload import Hook
    sessions = Sessions(root)
    hook = Hook.read(raw)
    session = hook.session
    env = sessions.environment(session)
    if not env or not sessions.read(session).provider:
        top = checkout(Path(hook.cwd)) if hook.cwd else None
        env = top.name if top else prefer or sessions.choose(session, provider.name, default_env(root))
        sessions.bind(session, env, pid=agent_pid(pid), provider=provider.name)
        environments = Environments(Record(root, env), actor=SYSTEM)
        environments._seat(env, session)
        wrapper = f"{provider.name}-{agent_pid(pid)}"
        if top and sessions.known(wrapper):
            sessions.bind(wrapper, env)
    elif not alive(sessions.read(session).pid):
        sessions.write(session, pid=agent_pid(pid))
    sessions.touch(session)
    return handle(provider, root, env, hook)


def handle(provider, root: Path, env: str, hook) -> dict:
    from providers.payload import Hook
    hook = Hook.read(hook) if isinstance(hook, dict) else hook
    if hook.event not in STATUS or runtime.off(root):
        return {}
    record = Record(root, env, memo=True)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    if provider.is_subagent(hook):
        if hook.event == PERMISSION or row.asking:
            agents.update(row.n, asking=provider.asking(hook))
        return provider.response(blocked=gated(provider, record, hook, row.title)) if hook.event == "PreToolUse" else {}
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.file_path, "session": hook.session, "size": hook.tool.result_size, "skill": hook.tool.loaded_skill, "cause": AGENT},
               status=provider.status(hook) or row.status or IDLE, **provider.facts(row, hook, root), **commands.shell(row, hook),
               wrote=hook.event == "PostToolUse" and commands.writes(hook))
    if hook.event == "PreToolUse":
        why = gated(provider, record, hook, row.title)
        return provider.response(blocked=f"{why}{alongside(hook)}" if why else "")
    if hook.event == "SessionStart":
        return provider.response(hook.event, start(root, env, provider.compacted(hook)))
    if hook.event == "Stop" and hook.last_message:
        stopped(root, hook.session, hook.last_message)
    return {}
