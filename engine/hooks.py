import re
import time
from pathlib import Path

from controllers.types import Agents, Environments, Nudges
from engine.actors import COMPACTING, IDLE, STOPPED, WORKING
from engine.record import Record
from engine.sessions import Sessions, agent_pid
from resources.base import AGENT, SYSTEM
from engine import runtime

STATUS = {"SessionStart": IDLE, "Stop": IDLE, "UserPromptSubmit": WORKING, "PreToolUse": WORKING,
          "PostToolUse": WORKING, "PreCompact": COMPACTING, "SubagentStart": "",
          "SubagentStop": "", "SessionEnd": STOPPED}
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


JOURNAL = re.compile(r"(?:\A|[|;&\n]|\$\()[ \t]*(journal[ \t]+[^|;&\n]+)")


def serving(policy, provider, hook) -> bool:
    feature = getattr(policy, "feature", None)
    return not feature or feature.runs_for_subagents or not provider.is_subagent(hook)


def alongside(hook) -> str:
    ran = [found.group(1).strip() for found in JOURNAL.finditer(hook.command or "")]
    return f" — and these were on the same line, so they did not run either: {'; '.join(ran)}" if ran else ""


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
    return prefer or runtime.env(root)


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> dict:
    from providers.payload import Hook
    sessions = Sessions(root)
    session = Hook.read(raw).session
    env = sessions.environment(session)
    if not env or not sessions.read(session).get("provider"):
        env = sessions.choose(session, provider.name, default_env(root, prefer))
        sessions.bind(session, env, pid=agent_pid(pid), provider=provider.name)
        seated(root, env, session)
    sessions.touch(session)
    return handle(provider, root, env, raw)


def seated(root: Path, env: str, session: str) -> None:
    envs = Environments(Record(root, env), actor=SYSTEM)
    row = envs._titled(env) or envs.create(env)
    envs.update(row.n, holder=session)


def handle(provider, root: Path, env: str, raw: dict) -> dict:
    from providers.payload import Hook
    hook = Hook.read(raw)
    if hook.event not in STATUS or runtime.off(root):
        return {}
    log_command(root, hook)
    record = Record(root, env, memo=True)
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(hook.session)
    if provider.is_subagent(hook):
        return provider.response(blocked=next((reason for policy in POLICIES if serving(policy, provider, hook)
                                               and (reason := policy(provider, record, hook, row.title))), "")) if hook.event == "PreToolUse" else {}
    uses = int(row.uses or 0) + (hook.event == "PreToolUse")
    context = provider.context(hook)
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.file_path, "session": hook.session},
               status=STATUS[hook.event] or row.status or IDLE, event=hook.event, tool=hook.tool.name, **provider.shell(row, hook),
               **provider.session(hook.transcript), file=hook.tool.file_path,
               wrote=hook.event == "PostToolUse" and provider.writes(hook), cwd=hook.cwd or row.cwd or "", at=time.time(),
               provider=provider.name, uses=uses, transcript=str(hook.transcript or row.transcript or ""), inbox=provider.inbox(hook) or row.inbox or "",
               model=provider.model(hook) or row.model or "", effort=provider.effort(Path(hook.cwd or root.parent), hook.transcript), started=row.started or time.time(),
               context=row.context or 0 if context is None else context)
    if hook.event == "PreToolUse":
        why = next((reason for policy in POLICIES if serving(policy, provider, hook) and (reason := policy(provider, record, hook, row.title))), "")
        return provider.response(blocked=f"{why}{alongside(hook)}" if why else "")
    if hook.event == "SessionStart":
        return provider.response(hook.event, start(root, env, provider.compacted(hook)))
    if hook.event in ("PostToolUse", "UserPromptSubmit"):
        return provider.response(hook.event, whispered(record, row.title))
    return {}
