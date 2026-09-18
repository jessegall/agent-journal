from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.resources.base import SYSTEM


class Work(Feature):
    name = "work"
    title_ = "Work"
    abstract_ = "Work started for a to-do is linked to it; work ended --todo closes the row; open work is said on idle"
    help_ = "Start work with --todo=<n> to take a row; end it with --todo to close the row with it."
    trigger = {"on": trigger.IDLE}

    @on("work.created")
    def started(self, event, record) -> None:
        works = CONTROLLERS["work"](record, actor=SYSTEM)
        n = works.load(event.n).data.get("todo")
        if not n:
            return
        todos = CONTROLLERS["todo"](record, actor=SYSTEM)
        todo = todos.load(int(n))
        works.link(event.n, todo.ref)
        todos.update(todo.n, status="started", work=event.n)

    @on("work.completed")
    def ended(self, event, record) -> None:
        work = CONTROLLERS["work"](record, actor=SYSTEM).load(event.n)
        n = work.data.get("todo")
        if not n or not event.data.get("todo"):
            return
        todos = CONTROLLERS["todo"](record, actor=SYSTEM)
        if not todos.load(int(n)).completed:
            todos.complete(int(n), how=f"work {work.n} ended")

    @on("agent.updated")
    def remind(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        for w in CONTROLLERS["work"](record, actor=SYSTEM).all():
            if not w.completed:
                return self.nudge(record, agent, f"work {w.n} open")
