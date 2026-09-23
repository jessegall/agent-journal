import time
from pathlib import Path
from engine.actors import COMPACTING, WORKING
from providers import PROVIDERS
from engine.stored import write_json
from engine.proc import git
from engine import runtime
from controllers.types import Agents
from resources.base import SYSTEM
from resources.types import AgentRow
from engine.fields import number_of, text_of
from dataclasses import dataclass

DISPATCHED, RETURNED = "dispatched", "returned"
WEB_HOSTS = ("github.com", "gitlab.com", "bitbucket.org")


def web_remote(url: str) -> str:
    if url.startswith("git@") or (url.startswith("ssh://") and "@" in url):
        url = f"https://{url.removeprefix('ssh://').split('@', 1)[-1].replace(':', '/', 1)}"
    url = url.removesuffix(".git").rstrip("/")
    host = url.split("://", 1)[-1].split("/", 1)[0]
    return url if url.startswith("https://") and host in WEB_HOSTS else ""



@dataclass(frozen=True)
class SubagentRow:
    id: str
    task: str
    kind: str
    model: str
    ended: float
    status: str

    @classmethod
    def from_json(cls, raw: dict) -> "SubagentRow":
        return cls(text_of(raw, "id", "session", "task"), text_of(raw, "task"), text_of(raw, "type"), text_of(raw, "model"), number_of(raw, "ended"),
                   text_of(raw, "status"))

class Seat:
    def branch(self) -> str:
        last = self.agent.driver.last_report()
        cwd = (last and last.cwd) or str(self.record.root.parent)
        if time.time() - self.branched_at < 10:
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
        if not path or time.time() - self.crewed_at < 10:
            return
        self.crewed_at = time.time()
        try:
            size = Path(path).stat().st_size
        except OSError:
            return
        if size == self.crewed_size:
            return
        self.crewed_size = size
        facts = PROVIDERS[last.provider]().crew(Path(path)) if last.provider in PROVIDERS else {}
        self.subagents_moved(last, facts.get(AgentRow.subagent_rows))
        if facts and any(last.data.get(k) != v for k, v in facts.items()):
            compacting = facts.get("compacting")
            status = COMPACTING if compacting else WORKING if compacting is False and last.status == COMPACTING else last.status or ""
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

    def seat(self) -> None:
        self.branch()
        self.crew()
        last = self.agent.driver.last_report()
        write_json(runtime.session_file(self.record.root, self.agent.driver.session, "seat.json"), {"at": time.time(), "agent": self.agent.driver.name, "state": self.agent.state(), "env": self.record.env,
                                 "why": self.why, "printed": self.agent.driver.last_printed(),
                                 "report": {"title": last.title, **last.data} if last else {}})
