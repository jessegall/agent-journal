import time
from functools import cached_property
from pathlib import Path
from resources.types import COMPACTING, WORKING
from providers import PROVIDERS, workspace_folders
from providers.base import REFUSED
from providers.payload import HookEvent
from agents.terminal import seat_session
from engine import runtime
from engine.record import Record
from engine.sessions import SessionRecord, SessionsSnapshot, agent_pid, alive
from engine.stored import Growth, write_json
from engine.proc import git
from engine.seats import remember_terminal, seat_file
from engine.worktree import checkout, environment
from controllers.types import Agents, Environments
from resources.base import SYSTEM
from resources.types import AgentRow
from resources.fields import Loaded
from dataclasses import dataclass

DISPATCHED, RETURNED = "dispatched", "returned"
WEB_HOSTS = ("github.com", "gitlab.com", "bitbucket.org")
LOOK_EVERY = 10.0


def web_remote(url: str) -> str:
    if url.startswith("ssh://") and "@" in url:
        host, _, path = url.removeprefix("ssh://").split("@", 1)[-1].partition("/")
        url = f"https://{host.split(':', 1)[0]}/{path}"
    elif url.startswith("git@"):
        url = f"https://{url.split('@', 1)[-1].replace(':', '/', 1)}"
    url = url.removesuffix(".git").rstrip("/")
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return url if url.startswith("https://") and host in WEB_HOSTS else ""



def status_after(compacting, status: str) -> str:
    if compacting:
        return COMPACTING
    if compacting is False and status == COMPACTING:
        return WORKING
    return status or ""


@dataclass(frozen=True)
class SubagentRow(Loaded):
    aliases = {"id": ("id", "session", "task"), "kind": ("type",)}
    id: str = ""
    task: str = ""
    kind: str = ""
    model: str = ""
    ended: float = 0.0
    status: str = ""
    running: bool = False
    session: str = ""

    @property
    def address(self) -> str:
        return self.session or self.id

    def is_refused(self) -> bool:
        return self.status == REFUSED


class SeatReport:
    def __init__(self, record, agent):
        self.record = record
        self.agent = agent
        self.branched_at = 0.0
        self.branch_name = ""
        self.branch_stamp = None
        self.crewed_at = 0.0
        self.crew_growth = Growth()
        self.subagents_ended: dict | None = None
        self.pointed: tuple[str, str] = ("", "")

    def branch(self) -> str:
        last = self.agent.driver.last_report()
        cwd = (last and last.cwd) or str(self.record.root.parent)
        if time.time() - self.branched_at < LOOK_EVERY:
            return self.branch_name
        self.branched_at = time.time()
        try:
            stamp = (cwd, (Path(cwd) / ".git" / "HEAD").stat().st_mtime_ns)
        except OSError:
            stamp = (cwd, 0)
        if stamp == self.branch_stamp:
            return self.branch_name
        self.branch_stamp = stamp
        self.branch_name = git(["rev-parse", "--abbrev-ref", "HEAD"], cwd, timeout=2).strip()
        remote = git(["remote", "get-url", "origin"], cwd, timeout=2).strip()
        url = f"{web}/tree/{self.branch_name}" if self.branch_name and (web := web_remote(remote)) else ""
        if last and last.title and self.branch_name and (last.branch, last.branch_url) != (self.branch_name, url):
            self.agent.mark(last.status, last.event, branch=self.branch_name, branch_url=url, at=last.at)
        return self.branch_name

    def crew(self) -> None:
        last = self.agent.driver.last_report()
        path = last and last.title and last.transcript
        if not path or time.time() - self.crewed_at < LOOK_EVERY:
            return
        self.crewed_at = time.time()
        if not self.crew_growth.grew(Path(path)):
            return
        facts = PROVIDERS[last.provider]().crew(Path(path)) if last.provider in PROVIDERS else {}
        self.subagents_moved(last, facts.get(AgentRow.subagent_rows))
        if facts and any(last.data.get(k) != v for k, v in facts.items()):
            compacting = facts.get(AgentRow.compacting)
            status = status_after(compacting, last.status)
            self.agent.mark(status, last.event, at=last.at, **facts)

    def subagents_moved(self, last, subagents: list | None) -> None:
        if subagents is None:
            return
        known = self.subagents_ended
        if known is None:
            known = {sub.id: sub.ended for sub in map(SubagentRow.from_json, last.subagent_rows)}
        agents = Agents(self.record, actor=SYSTEM)
        rows = [SubagentRow.from_json(sub) for sub in subagents]
        for sub in rows:
            data = {"id": sub.id, "task": sub.task, "kind": sub.kind, "model": sub.model}
            if sub.id not in known:
                agents.subagent(last.n, DISPATCHED, **data)
            if sub.ended and not known.get(sub.id):
                agents.subagent(last.n, RETURNED, **data, status=sub.status)
        self.subagents_ended = {sub.id: sub.ended for sub in rows}

    def write(self, why: str) -> None:
        self.branch()
        self.crew()
        last = self.agent.driver.last_report()
        write_json(seat_file(self.record.root, self.agent.driver.session), {"at": time.time(), "agent": self.agent.driver.name, "state": self.agent.state(), "env": self.record.env,
                                 "why": why, "printed": self.agent.driver.last_printed(),
                                 "report": {"title": last.title, **last.data} if last else {}})
        if last and last.title:
            self.point(last.title)

    def point(self, session: str) -> None:
        terminal = self.agent.driver.session
        if self.pointed == (session, terminal):
            return
        remember_terminal(self.record.root, session, terminal)
        self.pointed = (session, terminal)


class HookBinding:
    def __init__(self, root: Path, provider, pid: int):
        self.root = root
        self.provider = provider
        self.caller = pid
        self.sessions = SessionsSnapshot(root)

    @cached_property
    def pid(self) -> int:
        return agent_pid(self.caller)

    @cached_property
    def owned(self) -> set[str]:
        return {r.title for r in Environments(Record(self.root, runtime.env(self.root)), actor=SYSTEM).all() if r.owner}

    def worked_in(self, hook) -> str:
        if self.provider.is_subagent(hook):
            return ""
        return environment(checkout(Path(hook.cwd), workspace_folders()) if hook.cwd else None)

    def environment(self, hook, prefer: str) -> str:
        session = hook.session
        held = self.sessions.read(session)
        worked = "" if prefer in self.owned else self.worked_in(hook)
        stays = bool(held.environment and held.provider) and (hook.event != HookEvent.SESSION_START or self.provider.compacted(hook)
                                                               or not self.moving(session, held, worked))
        env = held.environment if stays else self.bound(session, worked, prefer)
        if stays and not alive(held.pid):
            self.relaunched(session, held.pid)
        self.sessions.touch(session, held.worked_in if self.provider.is_subagent(hook) else worked)
        return env

    def moving(self, session: str, held: SessionRecord, worked: str) -> bool:
        if not worked or worked in (held.environment, held.worked_in) or worked in self.owned:
            return False
        own = {session, self.sessions.terminal(self.provider.name, self.pid)}
        return not set(self.sessions.holders(worked)) - own

    def bound(self, session: str, worked: str, prefer: str) -> str:
        env = worked or prefer or self.sessions.choose(session, self.provider.name, runtime.default_env(self.root), self.owned)
        seat_session(self.sessions, env, session, pid=self.pid, provider=self.provider.name)
        terminal = self.sessions.terminal(self.provider.name, self.pid)
        if worked and terminal:
            seat_session(self.sessions, env, terminal)
        return env

    def relaunched(self, session: str, old: int) -> None:
        terminal = self.sessions.terminal(self.provider.name, old)
        self.sessions.write(session, pid=self.pid)
        if terminal and terminal != self.sessions.terminal(self.provider.name, self.pid):
            self.sessions.write(terminal, environment="", pid=0)
