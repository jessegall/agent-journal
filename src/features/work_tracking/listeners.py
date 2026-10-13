from declaring.reach import Reach
from resources.command_runs import command_runs
from events import Fact
from events.agents import AgentReported, ClockTicked, ToolFinished
from events.files import FileEdited
from events.plans import PlanCompleted
from events.resources import AnyEvent
from events.todos import TodoCompleted
from events.work_tracking import (ClosedCounted, EditedInWork, EditsCounted, LogOverdue, LogWritten, OpenWorkRemains, ParkedWorkStands, PollingNamed, RowUnblocked,
                                  StillAwaiting, StillBlocked, TodoDoneWithWork, TodoLeftByWork, WaitCleared, WorkBegan, WorkDeclared, WorkEnded, WorkEndedByTodo,
                                  WorkNamedInHand, WorkTookTodo, WorkUndeclared)
from events.works import WorkCompleted, WorkCreated, WorkUpdated
from features.work_tracking.next import ready
from receiving import Listener
from resources.types import STOPPED, AgentRow, Question, Todo, Work
from serving import Clock, Providers, ReadElsewhere, ReadMarks, ReadRemembered, ReadRows, Settings

NAME = "work_tracking"
NAMED_PARKED = "named_parked"
ASKED_AGAIN_AFTER = 60
POLLED = 3
OPEN_REMINDERS = 3


def working(works: ReadRows[Work]) -> list[Work]:
    return [w for w in works.rows.standing() if not w.parked]


def reaching_log(agents: ReadRows[AgentRow]) -> list[AgentRow]:
    """The agents the log-held line reaches: the ones that have not stopped, of the kind that line is for."""
    return [agent for agent in agents.rows.standing() if agent.status != STOPPED and Reach.MAIN.reaches(agent.subagent)]


def parking(work: Work) -> str:
    return f"{work.n}:{work.parked}"


def parked_to_name(works: ReadRows[Work], agents: ReadRows[AgentRow], memory: ReadRemembered, elsewhere: ReadElsewhere) -> list[Fact]:
    """Parked work not yet named for this parking, only while nothing else is ready: parking it was the agent's own choice."""
    parked = {parking(w): w for w in works.rows.standing() if w.parked}
    unnamed = [w for key, w in parked.items() if key not in set(memory.get(NAMED_PARKED, [])) & set(parked)]
    agent = agents.primary_to_read()
    if not unnamed or not agent or ready(elsewhere.here().record):
        return []
    first = unnamed[0]
    return [ParkedWorkStands(agent=agent.n, work=first.n, title=first.title, why=first.parked, more=f" and {len(unnamed) - 1} more" if len(unnamed) > 1 else "",
                             parkings=tuple(sorted(parked)))]


def unblocked(todos: ReadRows[Todo], agents: ReadRows[AgentRow], ref: str) -> list[Fact]:
    agent = agents.primary_to_read()
    rows = [r for r in todos.rows.standing() if ref in r.after and not r.blocked and not todos.waits(r)] if agent else []
    return [RowUnblocked(agent=agent.n, n=row.n, title=row.title, closed=ref.replace(":", " ")) for row in rows]


class SpotDeclaring(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, works: ReadRows[Work]) -> list[Fact]:
        if event.type != "work" and (event.type, event.action) != ("agent", "created"):
            return []
        return [WorkDeclared()] if working(works) else [WorkUndeclared()]


class SpotWorkOpened(Listener[WorkCreated]):
    def listen(self, event: WorkCreated, works: ReadRows[Work]) -> list[Fact]:
        todo = works.load(event.n).todo
        facts = [WorkBegan(work=event.n)]
        if todo:
            facts.append(WorkTookTodo(work=event.n, todo=int(todo)))
        return facts


class SpotWorkEnded(Listener[WorkCompleted]):
    def listen(self, event: WorkCompleted, works: ReadRows[Work], todos: ReadRows[Todo], agents: ReadRows[AgentRow], memory: ReadRemembered, elsewhere: ReadElsewhere) -> list[Fact]:
        todo = works.load(event.n).todo
        facts = [WorkEnded(work=event.n), *parked_to_name(works, agents, memory, elsewhere)]
        if todo and not todos.load(todo).completed:
            facts.append(TodoDoneWithWork(work=event.n, todo=int(todo)) if event.todo else TodoLeftByWork(todo=int(todo)))
        return facts


class SpotParkedWork(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, works: ReadRows[Work], agents: ReadRows[AgentRow], memory: ReadRemembered, elsewhere: ReadElsewhere) -> list[Fact]:
        if any(int(w.todo) == event.n for w in works.rows.standing()):
            return []
        return parked_to_name(works, agents, memory, elsewhere)


class SpotUnblockedByTodo(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, todos: ReadRows[Todo], agents: ReadRows[AgentRow]) -> list[Fact]:
        return [] if todos.load(event.n).struck else unblocked(todos, agents, f"todo:{event.n}")


class SpotUnblockedByPlan(Listener[PlanCompleted]):
    def listen(self, event: PlanCompleted, todos: ReadRows[Todo], agents: ReadRows[AgentRow]) -> list[Fact]:
        return unblocked(todos, agents, f"plan:{event.n}")


class SpotBlockedRows(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, todos: ReadRows[Todo], agents: ReadRows[AgentRow], questions: ReadRows[Question], memory: ReadRemembered, settings: Settings,
               clock: Clock) -> list[Fact]:
        closed, agent = int(memory.get("closed", 0)) + 1, agents.primary_to_read()
        if not agent or closed % max(1, int(settings.ask_blocked_every)):
            return [ClosedCounted(closed=closed)]
        asked_at, now = dict(memory.get("asked", {})), clock.now()
        questioned = {ref for q in questions.rows.standing() for ref in q.refs}
        due = [r for r in todos.rows.standing() if r.blocked and now - float(asked_at.get(str(r.n), 0)) > ASKED_AGAIN_AFTER and r.ref not in questioned]
        return [ClosedCounted(closed=closed), *(StillBlocked(agent=agent.n, n=r.n, title=r.title, why=r.blocked.rstrip("."), at=now) for r in due)]


class SpotWorkOfDoneTodo(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, works: ReadRows[Work], todos: ReadRows[Todo]) -> list[Fact]:
        how = todos.load(event.n).outcome or f"todo {event.n} done"
        return [WorkEndedByTodo(work=w.n, how=how) for w in works.rows.standing() if int(w.todo) == event.n]


class SpotEditedFile(Listener[FileEdited]):
    def listen(self, event: FileEdited, works: ReadRows[Work]) -> list[Fact]:
        return [EditedInWork(agent=event.agent, work=w.n, path=event.path, kind=event.kind, before=event.before, after=event.after, added=event.added, removed=event.removed)
                for w in working(works)[:1]]


class SpotPolling(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, agents: ReadRows[AgentRow], works: ReadRows[Work], providers: Providers) -> list[Fact]:
        row = agents.peek(event.agent)
        shell = [c["command"] for c in row.data.get("commands") or [] if c.get("tool") == "Bash" and c.get("command")][-POLLED:]
        if len(shell) < POLLED or len(set(shell)) > 1 or any(w.awaiting for w in working(works)):
            return []
        provider = providers.offers(row.provider)
        return [PollingNamed(agent=row.n, times=POLLED, command=shell[-1][:80], wakes=bool(provider and provider.background_wakes)).once(f"{row.n}:{shell[-1]}")]


class SpotWaitCleared(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, agents: ReadRows[AgentRow], works: ReadRows[Work]) -> list[Fact]:
        runs = command_runs(agents.peek(event.agent))
        started = runs[-1].at if runs else 0.0
        return [WaitCleared(agent=event.agent, work=w.n, awaiting=w.awaiting) for w in working(works)[:1] if w.is_self_clearing and started > float(w.awaiting_since)]


class SpotStillAwaiting(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, works: ReadRows[Work], settings: Settings, clock: Clock) -> list[Fact]:
        every, now = settings.ask_awaiting_every, clock.now()
        waiting = [w for w in working(works)[:1] if w.is_self_clearing and every]
        minutes = {w.n: int((now - (w.awaiting_since or now)) // 60) for w in waiting}
        return [StillAwaiting(agent=event.agent, awaiting=w.awaiting, minutes=minutes[w.n]).once(f"{event.agent}:{w.n}:{minutes[w.n] // every}")
                for w in waiting if minutes[w.n] >= every]


class SpotOpenWork(Listener[AgentReported]):
    def listen(self, event: AgentReported, works: ReadRows[Work], marks: ReadMarks) -> list[Fact]:
        return [OpenWorkRemains(agent=event.agent, work=w.n, updated=w.updated, logged=bool(w.sections)) for w in working(works)[:1]
                if not marks.used_up("open", f"{w.n}:{w.updated}", OPEN_REMINDERS)]


class SpotEdits(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, agents: ReadRows[AgentRow], works: ReadRows[Work], marks: ReadMarks, settings: Settings) -> list[Fact]:
        work = working(works)[:1]
        if not agents.peek(event.agent).wrote or not work:
            return []
        edits, every = marks.last(NAME).edits + 1, settings.name_work_every
        facts = [EditsCounted(agent=event.agent, edits=edits)]
        if every and edits % every == 0:
            facts.append(WorkNamedInHand(agent=event.agent, work=work[0].n, title=work[0].title))
        if edits >= settings.log_after:
            facts.append(LogOverdue(agent=event.agent, work=work[0].n, edits=edits))
        return facts


class SpotLogEntry(Listener[WorkUpdated]):
    def listen(self, event: WorkUpdated, agents: ReadRows[AgentRow]) -> list[Fact]:
        return [LogWritten(agent=agent.n) for agent in reaching_log(agents)] if event.section else []
