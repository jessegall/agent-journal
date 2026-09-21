import time

from controllers.types import Agents, Todos, Works
from features import trigger
from features.base import Behaviour, Feature, command, event, held, gate
from features.work import tracker
from features.work.auto import refusal
from features.work.next import next
from resources.base import Refused, SYSTEM
from resources.types import Work


class WorkFeature(Feature):
    name = "work"
    title_ = "Working"
    abstract_ = "A write is refused until work is open; work started for a to-do is linked to it, its log is kept, twenty edits without an entry hold the writes, and parked work is set aside until the next log entry"
    help_ = ('One piece of work is in hand at a time: starting another is refused until this one is ended or parked. Take a row with journal todo start <n>, or start work of its own with journal work start "<title>"; log each decision and turn with journal work log "<message>" (work.log_after, 20 edits without an entry holds the writes); end it with journal work end <n> --how "<what landed>", and --set todo=<n> closes the row with it. journal work park "<why>" sets it aside with no clock — it stays open, stops being nudged and stops holding writes, and journal work resume <n> picks it up again. Park when you are stuck or when something else has to happen first; never to wait for an answer you could carry on without, because under auto the list stops.'
             " Auto mode is off by default: turning it on is the user's word to work the list and decide without blocking questions. The next ready row by priority is offered on idle while nothing is open; five minutes quiet with unparked work open earns a direct question, are you still working? A row is ready when it is not blocked, waits on no open row or question, and its plan's phase is current.")
    aliases = (("auto", "auto"),)
    behaviours = {"auto": Behaviour("Work the list without asking", "The next ready row is offered on idle, and blocking questions are refused",
                                    default=False, trigger={"on": trigger.IDLE})}
    trigger = {"on": trigger.WORKED}
    EDITS, LOG_AFTER, SAID_AFTER = "edits", "log_after", "said_after"
    log_after = 20
    said_after = 10

    @command("work")
    def log(self, works: Works, text: str, n: int = 0):
        row = self.in_hand(works, n)
        return works.section(row.n, f"{len(row.sections) + 1} · {time.strftime('%Y-%m-%d %H:%M')}", text)

    @command("work")
    def park(self, works: Works, why: str, n: int = 0):
        return works.update(self.in_hand(works, n).n, parked=why)

    @command("work")
    def resume(self, works: Works, n: int):
        busy = works.active()
        if busy:
            raise Refused(f"work {busy.n} is open: end it or park it before picking up another")
        row = works.load(n)
        if not row.parked:
            raise Refused(f"work {row.n} is not parked")
        return works.update(n, parked="")

    def in_hand(self, works: Works, n: int = 0):
        row = works.load(n) if n else works.active()
        if not row:
            raise Refused('nothing is open: journal work start "<the work>" first')
        if n and (row.completed or row.parked):
            raise Refused(f"work {row.n} is {'done' if row.completed else 'parked'}; the one in hand is what a log entry means")
        return row

    def working(self, record) -> list:
        return [w for w in self.standing(record, Works) if not w.parked]

    @event("work")
    @event("agent.created")
    def declared(self, event, record) -> None:
        if self.working(record):
            self.release(record)
        else:
            self.hold(record, 'nothing is open, so this write would not be filed: journal work start "<the work>" first')

    @gate
    def held(self, provider, record, hook, session) -> str:
        return held(record, session) if provider.writes(hook) else ""

    @event("work.created")
    def opened(self, event, record) -> None:
        tracker.begin(event, record)

    @event("work.completed")
    def closed(self, event, record) -> None:
        tracker.end(event, record)

    @event("agent.updated")
    def tracked(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.event != "PostToolUse" or not agent.wrote:
            return
        for work in self.working(record)[:1]:
            tracker.record_files(agent, record, work)

    @event("work.created")
    def started(self, event, record) -> None:
        works = Works(record, actor=SYSTEM)
        n = works.load(event.n).todo
        if not n:
            return
        todos = Todos(record, actor=SYSTEM)
        todo = todos.load(int(n))
        works.link(event.n, todo.ref)
        todos.update(todo.n, status="started", work=event.n)

    @event("work.completed")
    def ended(self, event, record) -> None:
        work = Works(record, actor=SYSTEM).load(event.n)
        n = work.todo
        if not n or not event.data.get(Work.todo):
            return
        todos = Todos(record, actor=SYSTEM)
        if not todos.load(int(n)).completed:
            todos.complete(int(n), how=f"work {work.n} ended")

    @event("agent.updated")
    def remind(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        for w in self.working(record)[:1]:
            close = f'journal work end {w.n} --how "<what landed>", or journal work park {w.n} "<why it waits>"'
            if w.sections:
                self.nudge(record, agent, f"work {w.n} is still open", brief=f"end it or park it before you stop: {close}")
            else:
                self.nudge(record, agent, f"work {w.n} is still open, with nothing logged",
                           brief=f'journal work log {w.n} "<what was decided or done, and why>" — then {close}')

    @event("agent.updated")
    def edited(self, event, record) -> None:
        agent = self.agent(event, record)
        work = self.working(record)[:1]
        if not agent or not agent.wrote or not work:
            return
        edits = int(trigger.last(record, agent.title, self.name).get(self.EDITS) or 0) + 1
        trigger.write(record, agent, self.name, edits=edits)
        said = self.setting(record, self.SAID_AFTER, self.said_after)
        if said and edits % said == 0:
            self.nudge(record, agent, f"work {work[0].n} in hand — {work[0].title}",
                       brief="if this is not what you are doing, end it or park it and start the work you are in", private=True)
        if edits >= self.setting(record, self.LOG_AFTER, self.log_after):
            self.hold(record, f'{edits} edits since work {work[0].n} was last logged: journal work log "<what was decided or done, and why>" before any other write')

    @event("work.updated")
    def logged(self, event, record) -> None:
        if not event.data.get("section"):
            return
        for agent in self.live(record):
            trigger.write(record, agent, self.name, edits=0)
        self.release(record)

    @gate
    def no_blocking_question(self, provider, record, hook, session) -> str:
        return refusal(provider, hook) if self.on(record, "auto") else ""

    @event("agent.updated")
    def offer(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or not self.due(record, agent, "auto"):
            return
        if [w for w in self.standing(record, Works) if not w.parked]:
            return
        row = next(record)
        if row:
            self.nudge(record, agent, f"todo {row.n} next")
