import json
import time
from pathlib import Path

from controllers.types import Agents, Nudges
from engine.actors import COMPACTING, IDLE, STOPPED, WORKING
from engine.record import Record
from engine.sessions import Sessions
from resources.base import AGENT, SYSTEM
from resources.types import AgentRow

STATUS = {"SessionStart": IDLE, "Stop": IDLE, "UserPromptSubmit": WORKING, "PreToolUse": WORKING,
          "PostToolUse": WORKING, "PreCompact": COMPACTING, "SubagentStart": WORKING,
          "SubagentStop": WORKING, "SessionEnd": STOPPED}
EVENTS = tuple(STATUS)
POLICIES: list = []


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return root / "runtime" / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return root / "runtime" / f"gate-{env}-{session}.json"


def log_command(root: Path, hook) -> None:
    if hook.event != "PreToolUse" or not hook.command:
        return
    target = root / "runtime" / "commands.log"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a") as out:
        out.write(f"{time.time():.3f}\t{hook.command!r}\n")


def whispered(record: Record, session: str) -> str:
    nudges = Nudges(record, actor=AGENT)
    mine = [n for n in nudges.unread() if n.private and n.session == session]
    for n in mine:
        nudges.read(n.n)
    return "\n".join(dict.fromkeys(f"{n.title}{' — ' + n.brief if n.brief else ''}" for n in mine))


def start(root: Path, env: str, compacted: bool) -> str:
    path = start_file(root, env, compacted)
    return path.read_text() if path.is_file() else ""


def default_env(root: Path, prefer: str = "") -> str:
    f = root / "runtime" / "env"
    return prefer or (f.read_text().strip() if f.is_file() else "main")


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> tuple[dict, str]:
    from providers.payload import Hook
    sessions = Sessions(root)
    session = Hook.read(raw).session
    env = sessions.environment(session) or sessions.bind(session, default_env(root, prefer), pid=pid)["environment"]
    sessions.touch(session)
    return respond(provider, root, env, raw)


def handle(provider, root: Path, env: str, raw: dict) -> dict:
    return respond(provider, root, env, raw)[0]


def respond(provider, root: Path, env: str, raw: dict) -> tuple[dict, str]:
    from providers.payload import Hook
    hook = Hook.read(raw)
    if hook.event not in STATUS or (root / "runtime" / "off").is_file():
        return {}, ""
    log_command(root, hook)
    record = Record(root, env, memo=True)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    uses = int(row.uses or 0) + (hook.event == "PreToolUse")
    context = provider.context(hook)
    agents.update(row.n, status=STATUS[hook.event], event=hook.event, tool=hook.tool.name, **provider.shell(row, hook),
                  **provider.session(hook.transcript), file=hook.tool.file_path,
                  wrote=hook.event == "PostToolUse" and provider.writes(hook), cwd=hook.cwd or row.cwd or "", at=time.time(),
                  provider=provider.name, uses=uses, transcript=str(hook.transcript or row.transcript or ""),
                  model=provider.model(hook) or row.model or "", started=row.started or time.time(),
                  context=row.context or 0 if context is None else context)
    if hook.event == "PreToolUse":
        why = next((reason for policy in POLICIES if (reason := policy(provider, record, hook, row.title))), "")
        return provider.response(blocked=why), why
    if hook.event == "SessionStart":
        return provider.response(hook.event, start(root, env, provider.compacted(hook))), ""
    if hook.event in ("PostToolUse", "UserPromptSubmit"):
        return provider.response(hook.event, whispered(record, row.title)), ""
    return {}, ""
