import re
import threading
import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, ResourceEvent
from features.parts import AgentContext, Context, Handler


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False

    @classmethod
    def read(cls, event) -> "CheckUpdated":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, ran=bool(event.data.get("ran")))


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
            threading.Thread(target=self.run, args=(checks, check.n, key), daemon=True).start()

    def run(self, checks, n: int, key: str) -> None:
        try:
            checks.run(n, wait=True)
        finally:
            self.running.discard(key)


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
