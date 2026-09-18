from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.features.auto.next import next
from v2.resources.base import SYSTEM


class Auto(Feature):
    name = "auto"
    title_ = "Auto mode"
    abstract_ = "The next ready row, by priority, offered on idle while nothing is open"
    help_ = "Off by default: enabling it is the user's word to work the list. A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current."
    trigger = {"on": trigger.IDLE}
    default = False

    @on("agent.updated")
    def offer(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        if any(not w.completed for w in CONTROLLERS["work"](record, actor=SYSTEM).all()):
            return
        row = next(record)
        if row:
            self.nudge(record, agent, f"todo {row.n} next")
