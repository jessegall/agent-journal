from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.resources.base import SYSTEM


class Reminders(Feature):
    name = "reminders"
    title_ = "Reminders"
    abstract_ = "The standing reminders said again to the agent, on idle by default"
    help_ = "Set triggers.reminders to {every, unit} or {on} to change when they are said."
    trigger = {"on": trigger.IDLE}

    @on("agent.updated")
    def repeat(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        standing = [r for r in CONTROLLERS["reminder"](record, actor=SYSTEM).all() if not r.completed]
        if standing:
            plural = "s" if len(standing) > 1 else ""
            self.nudge(record, agent, f"{len(standing)} reminder{plural} standing, read them", "; ".join(f"{r.n}. {r.title}" for r in standing))
