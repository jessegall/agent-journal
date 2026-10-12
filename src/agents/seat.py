import time
from functools import cached_property
from pathlib import Path
from resources.types import COMPACTING, SubagentRow, WORKING
from providers import PROVIDERS, workspace_folders
from payload import HookEvent
from agents.terminal import seat_session
from engine import runtime
from engine.record import Record
from engine.sessions import Seat, SessionRecord, Sessions, agent_pid, alive
from engine.stored import Growth
from engine.proc import git
from engine.seats import remember_terminal, write_seat
from engine.worktree import checkout, environment
from controllers.types import Agents, Environments, Questions
from resources.base import SYSTEM
from resources.types import AgentRow
from dataclasses import dataclass

DISPATCHED, RETURNED = "dispatched", "returned"
WEB_HOSTS = ("github.com", "gitlab.com", "bitbucket.org")
LOOK_EVERY = 10.0
SEAT_AGAIN = 10.0
HEARD_EVERY = 30.0


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
        self.seated: dict = {}
        self.seated_at = 0.0

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
            self.agent.note(branch=self.branch_name, branch_url=url)
        return self.branch_name

    def crew(self) -> None:
        last = self.agent.driver.last_report()
        path = last and last.title and last.transcript
        if not path or time.time() - self.crewed_at < LOOK_EVERY:
            return
        self.crewed_at = time.time()
        provider = PROVIDERS[last.provider]() if last.provider in PROVIDERS else None
        if not self.crew_growth.grew(Path(path), provider.crew_stamp(Path(path)) if provider else ()):
            return
        facts = provider.crew(Path(path)) if provider else {}
        self.subagents_moved(last, facts.get(AgentRow.subagent_rows))
        if facts and any(last.data.get(k) != v for k, v in facts.items()):
            status = status_after(facts.get(AgentRow.compacting), self.agent.current().status)
            noted = dict(facts)
            if status != self.agent.current().status:
                noted[AgentRow.status] = status
            self.agent.note(**noted)

    def subagents_moved(self, last, subagents: list | None) -> None:
        if subagents is None:
            return
        known = self.subagents_ended
        if known is None:
            known = {**{sub.id: sub.ended for sub in map(SubagentRow.from_json, last.subagent_rows)}, **last.announced}
        agents = Agents(self.record, actor=SYSTEM)
        rows = [SubagentRow.from_json(sub) for sub in subagents]
        for sub in rows:
            data = {"id": sub.id, "task": sub.task, "kind": sub.kind, "model": sub.model}
            if sub.id not in known:
                agents.subagent(last.n, DISPATCHED, **data)
            if sub.ended and not known.get(sub.id):
                agents.subagent(last.n, RETURNED, **data, status=sub.status)
        self.subagents_ended = {sub.id: sub.ended for sub in rows}
        if self.subagents_ended != last.announced:
            Agents(self.record, actor=SYSTEM).update(last.n, announced=self.subagents_ended)

    def write(self, why: str) -> None:
        self.branch()
        self.crew()
        last = self.agent.driver.last_report()
        content = {"agent": self.agent.driver.name, "state": self.agent.state(), "env": self.record.env, "why": why, "printed": self.agent.driver.last_printed(),
                   "report": {"title": last.title, **last.data} if last else {}}
        if content != self.seated or time.time() - self.seated_at >= SEAT_AGAIN:
            write_seat(self.record.root, self.agent.driver.session, {"at": time.time(), **content})
            self.seated, self.seated_at = content, time.time()
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
        self.sessions = Sessions(root)

    @cached_property
    def pid(self) -> int:
        return agent_pid(self.caller)

    @cached_property
    def owned(self) -> set[str]:
        return {row["title"] for row in Environments(Record(self.root, runtime.env(self.root)), actor=SYSTEM).rows.standing_summaries() if row.get("owner")}

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
        place = held.worked_in if self.provider.is_subagent(hook) else worked
        if not stays or place != held.worked_in or time.time() - held.seen >= HEARD_EVERY:
            self.sessions.touch(session, place)
        return env

    def moving(self, session: str, held: SessionRecord, worked: str) -> bool:
        if not worked or worked in (held.environment, held.worked_in) or worked in self.owned:
            return False
        own = {session, self.sessions.terminal(self.provider.name, self.pid)}
        return not set(self.sessions.holders(worked)) - own

    def bound(self, session: str, worked: str, prefer: str) -> str:
        env = worked or prefer or self.sessions.choose(session, self.provider.name, runtime.default_env(self.root), self.owned)
        rivals = self.sessions.rivals(Seat(env, session, self.pid, self.provider.name))
        if rivals:
            return self.asked_to_take_over(session, env, rivals[0])
        seat_session(self.sessions, Seat(env, session, self.pid), provider=self.provider.name)
        terminal = self.sessions.terminal(self.provider.name, self.pid)
        if worked and terminal:
            seat_session(self.sessions, Seat(env, terminal, self.pid), provider=self.provider.name)
        return env

    def asked_to_take_over(self, session: str, env: str, holder: str) -> str:
        """An environment has one live session: the one that starts beside another waits in an environment of its own, and the user is asked whether it takes the busy one over."""
        side = self.sessions.free(env)
        for each in self.sessions.agent(session, self.pid, self.provider.name):
            seat_session(self.sessions, Seat(side, each, self.pid, self.provider.name), provider=self.provider.name)
        asked = self.asked_about(env, holder) or self.asking(session, env, side, holder)
        self.sessions.write(session, takeover={"environment": env, "question": asked, "holder": holder})
        return side

    def asking(self, session: str, env: str, side: str, holder: str) -> int:
        """Puts the question to the user and answers with its number. It is the user's alone: the answer moves a working agent out of the environment it was launched for."""
        return Questions(Record(self.root, env), actor=SYSTEM).create(
            f"A second session started in {env}", brief=f"Session {session} started in {env}, where session {holder} is already working. It waits in {side} until you answer. "
            f"Taking {env} over unbinds {holder} from it, and {session} holds it.",
            options=[{"title": f"Take over {env}", "description": f"{holder} is unbound from {env}, and {session} works there"},
                     {"title": f"Stay in {side}", "description": f"{holder} keeps {env}"}], user_only=True).n

    def asked_about(self, env: str, holder: str) -> int:
        """The question the user has not answered yet about this pair - the busy environment and the session holding it - or none. Each session that starts beside the holder waits in an environment of its own, because an environment has one live session, but they all wait on the one question, so a pair is asked about once however many start."""
        questions = Questions(Record(self.root, env), actor=SYSTEM)
        return next((held.takeover["question"] for held in self.sessions.all().values()
                     if held.takeover.get("environment") == env and held.takeover.get("holder") == holder and held.environment
                     and questions.rows.exists(held.takeover["question"]) and not questions.rows.peek(held.takeover["question"]).completed), 0)

    def relaunched(self, session: str, old: int) -> None:
        terminal = self.sessions.terminal(self.provider.name, old)
        self.sessions.write(session, pid=self.pid)
        if terminal and terminal != self.sessions.terminal(self.provider.name, self.pid):
            self.sessions.write(terminal, environment="", pid=0)
