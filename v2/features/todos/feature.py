from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.features.todos.next import next
from v2.resources.base import SYSTEM


class Todos(Feature):
    name = "todos"
    title_ = "To-dos"
    abstract_ = "The next ready row, by priority, offered on idle when auto is on and nothing is open"
    help_ = "A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current."
    trigger = {"on": trigger.IDLE}

    @on("agent.updated")
    def offer(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent) or not record.setting("auto", False):
            return
        if any(not w.completed for w in CONTROLLERS["work"](record, actor=SYSTEM).all()):
            return
        row = next(record)
        if row:
            self.nudge(record, agent, f"todo {row.n} next")
