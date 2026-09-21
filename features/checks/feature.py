import threading
import time

from controllers.types import Agents, Notifications
from features.base import Feature, event
from features.checks.controller import Checks
from resources.base import SYSTEM


class ChecksFeature(Feature):
    name = "checks"
    title_ = "Checks"
    abstract_ = "Scripts that say pass or fail about the project, run on demand or on their own timer; a failure is filed and told to the agent"
    help_ = "A check is a row of its own: journal check create \"<what it guards>\" --set command=\"<command>\" --set every=<minutes>. It runs as its own process from the project root, never inside the server; exit 0 passes. A failing run files a notification and tells the agent; the next pass clears it."

    def __init__(self):
        self.running: set[str] = set()

    @event("agent.updated")
    def timer(self, event, record) -> None:
        for check in Checks(record, actor=SYSTEM)._due(time.time()):
            key = f"{record.root}:{check.n}"
            if key in self.running:
                continue
            self.running.add(key)
            threading.Thread(target=self.ran, args=(record, check.n, key), daemon=True).start()

    def ran(self, record, n: int, key: str) -> None:
        try:
            Checks(record, actor=SYSTEM).run(n, wait=True)
        finally:
            self.running.discard(key)

    @event("check.updated")
    def reported(self, event, record) -> None:
        if not event.data.get("ran"):
            return
        check = Checks(record, actor=SYSTEM).load(event.n)
        title = f"check {check.n} failed - {check.title}"[:80]
        notices = Notifications(record, actor=SYSTEM)
        if (check.last or {}).get("ok"):
            for stale in notices.linked_to(check.ref):
                if not stale.completed:
                    notices.complete(stale.n, how="the check passes again")
            return
        notices.create(title, brief=(check.last or {}).get("said") or "it said nothing", about=check.ref)
        agent = Agents(record, actor=SYSTEM).primary()
        if agent:
            self.nudge(record, agent, title, f"journal check show {check.n} says why; fix it, then journal check run {check.n}")
