import hashlib
import re
import time
from dataclasses import dataclass
import threading
from pathlib import Path

from controllers.types import Agents, Environments
from resources.types import IDLE
from engine.record import Record
from engine.sessions import Sessions, agent_pid, alive
from engine.worktree import checkout, environment
from resources.base import AGENT, SYSTEM
from engine import bus, chat, files, ran, runtime
from engine.stored import read_json, write_json
from providers import PROVIDERS, skill_folders
from providers.payload import PERMISSION, STATUS
from features.status_bar import commands
from engine.fields import Loaded
from engine.gates import AFTERWARDS, CANCELABLE, CANCELERS, DISPATCHING, LONG_COMMAND, POLICIES, cancelled, gate_file, start_file
from engine.reach import Reach
from engine.runtime import default_env

PAUSED = "The user paused the agent: wait, and carry on only once you are resumed."
PAUSE = Reach.BOTH


def gated(provider, record, hook, session: str) -> str | None:
    dispatch = provider.dispatch(hook.tool)
    reason = cancelled(DISPATCHING, provider, record, hook, session, dispatch, provider.is_subagent(hook)) if dispatch else None
    bus.defer(lambda: [policy(provider, record, hook, session) for policy in AFTERWARDS if serving(policy, provider, hook)])
    return reason or next((reason for policy in POLICIES if serving(policy, provider, hook) and (reason := policy(provider, record, hook, session))), None)


def relaunched(sessions: Sessions, session: str, provider: str, pid: int) -> None:
    terminal = sessions.terminal(provider, sessions.read(session).pid)
    sessions.write(session, pid=pid)
    if terminal:
        sessions.write(terminal, pid=pid)


JOURNAL = re.compile(r"(?:\A|[|;&\n]|\$\()[ \t]*(journal[ \t]+[^|;&\n]+)")


def serving(policy, provider, hook) -> bool:
    return policy.guard.reaches(provider.is_subagent(hook))


def paused(row, subagent: bool) -> bool:
    return bool(row.paused) and PAUSE.reaches(subagent)


def alongside(hook) -> str:
    ran = [found.group(1).strip() for shell in hook.tool.commands for found in JOURNAL.finditer(shell)]
    return f" — and these were on the same line, so they did not run either: {'; '.join(ran)}" if ran else ""


def start(root: Path, env: str, compacted: bool) -> str:
    path = start_file(root, env, compacted)
    return path.read_text() if path.is_file() else ""


SHOWING = threading.Lock()
DONE = "_done"
SENT = "_sent"
KEPT_DONE = 50
CATCH_UP = 600.0
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
class Chunk(Loaded):
    aliases = {"session": ("session_id",), "message": ("message_id",)}
    session: str = ""
    message: str = ""
    index: int = 0
    delta: str = ""
    final: bool = False


def display_chunk(root: Path, raw: dict) -> None:
    chunk = Chunk.from_json(raw)
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


def shown(parts: dict) -> str:
    return "".join(parts[i] for i in sorted(parts, key=int)).strip()


def stopped(root: Path, session: str, text: str) -> None:
    f = runtime.session_file(root, session, "displayed.json")
    with SHOWING:
        held = read_json(f, {})
        cut = [message for message, parts in held.items() if message not in (DONE, SENT) and shown(parts) and text.strip().startswith(shown(parts))]
        if not cut:
            return
        write_json(f, {**{key: value for key, value in held.items() if key not in cut}, DONE: [*held.get(DONE, []), *cut][-KEPT_DONE:]})
    send_to_chat(root, session, text)


def fingerprint(text: str) -> str:
    return hashlib.sha1(" ".join(text.split()).encode()).hexdigest()


def unfinished(root: Path, session: str, row) -> None:
    provider = PROVIDERS.get(row.provider)
    if provider is None or not row.transcript:
        return
    said = [turn.text for turn in provider().tail(row.transcript) if turn.has_agent_text and turn.at >= time.time() - CATCH_UP]
    f = runtime.session_file(root, session, "displayed.json")
    with SHOWING:
        held = read_json(f, {})
        first = SENT not in held
        write_json(f, {DONE: held.get(DONE, []), SENT: [*held.get(SENT, []), *(map(fingerprint, said) if first else [])][-KEPT_DONE:]})
    if first:
        return
    for text in said:
        send_to_chat(root, session, text)


def send_to_chat(root: Path, session: str, text: str) -> None:
    f = runtime.session_file(root, session, "displayed.json")
    with SHOWING:
        held = read_json(f, {})
        if fingerprint(text) in held.get(SENT, []):
            return
        write_json(f, {**held, SENT: [*held.get(SENT, []), fingerprint(text)][-KEPT_DONE:]})
    record = Record(root, Sessions(root).environment(session) or runtime.env(root))
    row = Agents(record, actor=SYSTEM)._titled(session)
    if row and text.strip():
        chat.send(record, row, text)


def owned_environments(root: Path) -> set[str]:
    return {r.title for r in Environments(Record(root, runtime.env(root)), actor=SYSTEM).all() if r.owner}


def worked_environment(hook) -> str:
    return environment(checkout(Path(hook.cwd)) if hook.cwd else None)


def held_elsewhere(sessions: Sessions, env: str, own: set[str]) -> bool:
    return bool(set(sessions.holders(env)) - own)


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> dict:
    from providers.payload import Hook
    sessions = Sessions(root)
    hook = Hook.read(raw, provider.tool_kinds)
    session = hook.session
    env = sessions.environment(session)
    worked = "" if provider.is_subagent(hook) else worked_environment(hook)
    moving = bool(worked and worked != env) and not held_elsewhere(sessions, worked, {session, sessions.terminal(provider.name, agent_pid(pid))})
    if not env or not sessions.read(session).provider or moving:
        env = worked or prefer or sessions.choose(session, provider.name, default_env(root), owned_environments(root))
        sessions.bind(session, env, pid=agent_pid(pid), provider=provider.name)
        environments = Environments(Record(root, env), actor=SYSTEM)
        environments._seat(env, session)
        terminal = sessions.terminal(provider.name, agent_pid(pid))
        if worked and terminal:
            sessions.bind(terminal, env)
            environments._seat(env, terminal)
    elif not alive(sessions.read(session).pid):
        relaunched(sessions, session, provider.name, agent_pid(pid))
    sessions.touch(session)
    return handle(provider, root, env, hook)


def handle(provider, root: Path, env: str, hook) -> dict:
    from providers.payload import Hook
    hook = Hook.read(hook, provider.tool_kinds) if isinstance(hook, dict) else hook
    if hook.event not in STATUS or runtime.off(root):
        return {}
    record = Record(root, env, memo=True)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    subagent = provider.is_subagent(hook)
    if subagent:
        if hook.event == PERMISSION or row.asking:
            agents.update(row.n, asking=provider.asking(hook))
        if hook.event != "PreToolUse":
            return {}
        why = PAUSED if paused(row, subagent) else gated(provider, record, hook, row.title)
        return {} if why is None else provider.blocking(why)
    wrote = hook.event == "PostToolUse" and commands.writes(hook)
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.paths[0] if hook.tool.paths else "", "session": hook.session, "size": hook.tool.result_size, "skill": hook.tool.loaded_skill, "cause": AGENT},
               status=provider.status(hook) or row.status or IDLE, **provider.facts(row, hook, root), **commands.shell(row, hook), wrote=wrote)
    if hook.event == "PostToolUse":
        bus.defer(lambda: ran.tool_ran(record, row.n, provider, hook.tool))
    if wrote:
        bus.defer(lambda: files.announce(record, row.n, skill_folders()))
    if hook.event == "PreToolUse" and paused(row, subagent):
        return provider.blocking(PAUSED)
    if hook.event == "PreToolUse":
        why = gated(provider, record, hook, row.title)
        return {} if why is None else provider.blocking(f"{why}{alongside(hook)}")
    if hook.event == "SessionStart":
        return provider.response(hook.event, start(root, env, provider.compacted(hook)))
    if hook.event == "Stop" and hook.last_message:
        stopped(root, hook.session, hook.last_message)
    if hook.event in ("Stop", "UserPromptSubmit"):
        unfinished(root, hook.session, row)
    return {}
