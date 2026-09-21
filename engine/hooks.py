import re
from pathlib import Path

from controllers.types import Agents, Environments, Nudges
from engine.actors import IDLE
from engine.record import Record
from engine.sessions import Sessions, agent_pid
from resources.base import AGENT, SYSTEM
from engine import runtime
from providers.payload import STATUS
from features.statusline import commands

POLICIES: list = []


def start_file(root: Path, env: str, compacted: bool = False) -> Path:
    return root / "runtime" / f"{'compact' if compacted else 'start'}-{env}.md"


def gate_file(root: Path, env: str, session: str) -> Path:
    return root / "runtime" / f"gate-{env}-{session}.json"


JOURNAL = re.compile(r"(?:\A|[|;&\n]|\$\()[ \t]*(journal[ \t]+[^|;&\n]+)")


def serving(policy, provider, hook) -> bool:
    feature = getattr(policy, "feature", None)
    return not feature or feature.runs_for_subagents or not provider.is_subagent(hook)


def alongside(hook) -> str:
    ran = [found.group(1).strip() for found in JOURNAL.finditer(hook.command or "")]
    return f" — and these were on the same line, so they did not run either: {'; '.join(ran)}" if ran else ""


def start(root: Path, env: str, compacted: bool) -> str:
    path = start_file(root, env, compacted)
    return path.read_text() if path.is_file() else ""


def default_env(root: Path, prefer: str = "") -> str:
    return prefer or runtime.env(root)


def answer(provider, root: Path, raw: dict, pid: int, prefer: str = "") -> dict:
    from providers.payload import Hook
    sessions = Sessions(root)
    hook = Hook.read(raw)
    session = hook.session
    env = sessions.environment(session)
    if not env or not sessions.read(session).get("provider"):
        env = sessions.choose(session, provider.name, default_env(root, prefer))
        sessions.bind(session, env, pid=agent_pid(pid), provider=provider.name)
        environments = Environments(Record(root, env), actor=SYSTEM)
        environments._seat(env, session)
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
        return provider.response(blocked=next((reason for policy in POLICIES if serving(policy, provider, hook)
                                               and (reason := policy(provider, record, hook, row.title))), "")) if hook.event == "PreToolUse" else {}
    agents.saw(row.n, {"hook": hook.event, "tool": hook.tool.name, "file": hook.tool.file_path, "session": hook.session},
               status=STATUS[hook.event] or row.status or IDLE, **provider.facts(row, hook, root), **commands.shell(row, hook),
               wrote=hook.event == "PostToolUse" and commands.writes(hook))
    if hook.event == "PreToolUse":
        why = next((reason for policy in POLICIES if serving(policy, provider, hook) and (reason := policy(provider, record, hook, row.title))), "")
        return provider.response(blocked=f"{why}{alongside(hook)}" if why else "")
    if hook.event == "SessionStart":
        return provider.response(hook.event, start(root, env, provider.compacted(hook)))
    if hook.event in ("PostToolUse", "UserPromptSubmit"):
        return provider.response(hook.event, Nudges(record, actor=AGENT)._whispered(row.title))
    return {}
