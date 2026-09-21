import threading
import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentUpdated, ResourceEvent
from features.parts import Context, Handler


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False

    @classmethod
    def read(cls, event) -> "CheckUpdated":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, ran=bool(event.data.get("ran")))


class RunDueChecks(Handler):
    def __init__(self):
        self.running: set[str] = set()

    def handle(self, context: Context, event: AgentUpdated) -> None:
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
        title = f"check {check.n} failed - {check.title}"[:80]
        if (check.last or {}).get("ok"):
            for stale in context.journal.notifications.linked_to(check.ref):
                if not stale.completed:
                    context.journal.clear(stale, "the check passes again")
            return
        context.journal.notify("failing", title=title, output=(check.last or {}).get("said") or "it said nothing", about=check.ref)
        agent = context.journal.agents.primary()
        if agent:
            context.speaking_to(agent).agent.say("failed", title=title, n=check.n)
