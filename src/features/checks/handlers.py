import fcntl
import re
import threading
import time
from dataclasses import dataclass
from typing import ClassVar

from engine import runtime
from engine.command_runs import CommandRun
from engine.events.agents import AgentReported
from engine.events.resources import ResourceEvent
from features.parts import AgentContext, Context, Handler


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False

    @classmethod
    def read(cls, event) -> "CheckUpdated":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, ran=bool(event.data.get("ran")))


TESTS = "tests"
ANSI = re.compile(r"\x1b\[[0-9;]*m")


class RunDueChecks(Handler):
    def __init__(self):
        self.running: set[str] = set()

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        checks = context.journal.checks
        for check in checks._due(time.time()):
            key = f"{context.record.root}:{check.n}"
            if key in self.running:
                continue
            self.running.add(key)
            threading.Thread(target=self.run, args=(checks, check.n, key, claim(context.record.root, check.n)), daemon=True).start()

    def run(self, checks, n: int, key: str, claimed) -> None:
        try:
            if claimed:
                checks.run(n, wait=True)
        finally:
            self.running.discard(key)
            if claimed:
                claimed.close()


def claim(root, n: int):
    lock = runtime.folder(root) / "check-reports" / f"{n}.lock"
    lock.parent.mkdir(parents=True, exist_ok=True)
    held = lock.open("w")
    try:
        fcntl.flock(held, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        held.close()
        return None
    return held


class ReportCheckResult(Handler):
    def handle(self, context: Context, event: CheckUpdated) -> None:
        if not event.ran:
            return
        check = context.journal.checks.load(event.n)
        last = check.last_run
        output = last.output
        found = summary(output)
        headline = found if found else check.title
        failure = check.failure.replace("{summary}", headline) if check.failure else ""
        title = (failure if failure else f"check {check.n} failed - {headline}")[:80]
        if last.ok:
            for stale in context.journal.notifications.linked_to(check.ref):
                if not stale.completed:
                    context.journal.clear(stale, "the check passes again")
            return
        context.journal.notify("failing", title=title, output=output if output else "it said nothing", about=check.ref)
        agent = context.journal.agents.primary()
        if agent:
            context.speaking_to(agent).agent.say("failed", title=title, n=check.n)


def summary(output: str) -> str:
    lines = [ANSI.sub("", line).strip() for line in output.splitlines()]
    return next((line for line in reversed(lines) if line and not line.startswith(("↳", "#"))), "")


class MarkTestRuns(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        run = CommandRun.from_json(row.running) if row.running else None
        if not run or run.effect != TESTS or not context.once("test_run", f"{run.at}|{run.done}"):
            return
        key = f"tests:{run.at}"
        if not run.done:
            context.journal.agents.card(row.n, key=key, label="Running tests", icon="check", command=run.command, state="running", started=run.at)
            return
        result = run.result
        counts = ", ".join(part for part in (f"{result.passed} passed" if result and result.passed else "",
                                             f"{result.failed} failed" if result and result.failed else "") if part)
        failed = bool(result and (result.ok is False or result.failed))
        context.journal.agents.card(row.n, key=key, label="Tests failed" if failed else "Tests passed", icon="check", command=run.command,
                                    state="failed" if failed else "done", started=run.at, ended=run.done, detail=counts)
