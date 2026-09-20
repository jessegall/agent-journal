import time

from controllers.types import Agents, Todos, Works
from features import trigger
from features.base import Feature, command, on
from features.work.tracker import tracker
from resources.base import SYSTEM
from resources.types import Work


class WorkFeature(Feature):
    name = "work"
    title_ = "Work"
    abstract_ = "Work started for a to-do is linked to it; its log is kept, and twenty edits without an entry hold the writes; work parked is set aside until the next log entry"
    help_ = 'Start work with --todo=<n> to take a row; log each decision and turn with journal work log <n> "<message>" (work.log_after, 20 edits, without an entry holds the writes); end it with --todo to close the row with it. journal work park <n> "<why>" sets it aside with no clock — it stays open, stops being nudged and stops holding writes, and the next log entry picks it up.'
    trigger = {"on": trigger.WORKED}
    EDITS, LOG_AFTER = "edits", "log_after"
    log_after = 20

    @command("work")
    def log(self, works: Works, n: int, text: str):
        if works.load(n).parked:
            works.update(n, parked="")
        return works.section(n, f"{len(works.load(n).sections) + 1} · {time.strftime('%Y-%m-%d %H:%M')}", text)

    @command("work")
    def park(self, works: Works, n: int, why: str):
        return works.update(n, parked=why)


    @on("work.created")
    def opened(self, event, record) -> None:
        tracker.begin(event, record)

    @on("work.completed")
    def closed(self, event, record) -> None:
        tracker.end(event, record)

    @on("agent.updated")
    def tracked(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.event != "PostToolUse":
            return
        for work in self.standing(record, Works)[:1]:
            tracker.record_files(agent, record, work)

    @on("work.created")
    def started(self, event, record) -> None:
        works = Works(record, actor=SYSTEM)
        n = works.load(event.n).todo
        if not n:
            return
        todos = Todos(record, actor=SYSTEM)
        todo = todos.load(int(n))
        works.link(event.n, todo.ref)
        todos.update(todo.n, status="started", work=event.n)

    @on("work.completed")
    def ended(self, event, record) -> None:
        work = Works(record, actor=SYSTEM).load(event.n)
        n = work.todo
        if not n or not event.data.get(Work.todo):
            return
        todos = Todos(record, actor=SYSTEM)
        if not todos.load(int(n)).completed:
            todos.complete(int(n), how=f"work {work.n} ended")

    @on("agent.updated")
    def remind(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        for w in self.standing(record, Works)[:1]:
            if w.sections:
                self.nudge(record, agent, f"work {w.n} open")
            else:
                self.nudge(record, agent, f"work {w.n} open, nothing logged", brief=f'journal work log {w.n} "<what was decided or done, and why>"')

    @on("agent.updated")
    def edited(self, event, record) -> None:
        agent = self.agent(event, record)
        work = self.standing(record, Works)[:1]
        if not agent or not agent.wrote or not work:
            return
        edits = int(trigger.last(record, agent.title, self.name).get(self.EDITS) or 0) + 1
        trigger.write(record, agent, self.name, edits=edits)
        if edits >= record.setting(self.name, {}).get(self.LOG_AFTER, self.log_after):
            self.hold(record, f'{edits} edits since work {work[0].n} was last logged: journal work log {work[0].n} "<what was decided or done, and why>" before any other write')

    @on("work.updated")
    def logged(self, event, record) -> None:
        if not event.data.get("section"):
            return
        for agent in Agents(record, actor=SYSTEM).all():
            trigger.write(record, agent, self.name, edits=0)
        self.release(record)
