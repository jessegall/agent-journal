from events import Fact
from events.work_tracking import (ClosedCounted, EditedInWork, EditsCounted, LogOverdue, LogWritten, OpenWorkRemains, ParkedWorkStands, PollingNamed, RowUnblocked,
                                  StillAwaiting, StillBlocked, TodoDoneWithWork, TodoLeftByWork, WaitCleared, WorkDeclared, WorkFilesLetGo, WorkEndedByTodo,
                                  WorkNamedInHand, WorkTookTodo, WorkUndeclared)
from features.work_tracking import tracker
from features.work_tracking.listeners import NAME, NAMED_PARKED, open_reminders
from receiving import Handler
from resources.types import AgentRow, Todo, Work
from serving import Chat, Elsewhere, Git, Marks, Remembered, Rows

POLLING = "polling"
POLLING_NO_WAKE = "polling, no wake"


class HoldUntilDeclared(Handler[WorkUndeclared]):
    def handle(self, event: WorkUndeclared, chat: Chat) -> list[Fact]:
        chat.hold("undeclared held")
        return []


class ReleaseOnceDeclared(Handler[WorkDeclared]):
    def handle(self, event: WorkDeclared, chat: Chat) -> list[Fact]:
        chat.release()
        return []


class LetGoOfWorkFiles(Handler[WorkFilesLetGo]):
    def handle(self, event: WorkFilesLetGo, elsewhere: Elsewhere) -> list[Fact]:
        tracker.forget(elsewhere.here().record, event.work)
        return []


class LinkTodoToWork(Handler[WorkTookTodo]):
    def handle(self, event: WorkTookTodo, works: Rows[Work], todos: Rows[Todo]) -> list[Fact]:
        works.link(event.work, todos.load(event.todo).ref)
        todos.update(event.todo, status="started", work=event.work)
        return []


class CompleteTodoWithWork(Handler[TodoDoneWithWork]):
    def handle(self, event: TodoDoneWithWork, todos: Rows[Todo]) -> list[Fact]:
        todos.complete(event.todo, how=f"work {event.work} ended")
        return []


class LeaveTodoByWork(Handler[TodoLeftByWork]):
    def handle(self, event: TodoLeftByWork, todos: Rows[Todo]) -> list[Fact]:
        todos.update(event.todo, status="")
        return []


class EndWorkOfTodo(Handler[WorkEndedByTodo]):
    def handle(self, event: WorkEndedByTodo, works: Rows[Work]) -> list[Fact]:
        works.complete(event.work, how=event.how)
        return []


class NameParkedWork(Handler[ParkedWorkStands]):
    def handle(self, event: ParkedWorkStands, chat: Chat, memory: Remembered) -> list[Fact]:
        chat.say("parked", n=event.work, title=event.title, why=event.why, more=f" and {event.others} more" if event.others else "")
        memory.set(NAMED_PARKED, list(event.parkings))
        return []


class NameUnblockedRow(Handler[RowUnblocked]):
    def handle(self, event: RowUnblocked, chat: Chat) -> list[Fact]:
        chat.say("unblocked", n=event.n, title=event.title, closed=event.closed)
        return []


class KeepClosedCount(Handler[ClosedCounted]):
    def handle(self, event: ClosedCounted, memory: Remembered) -> list[Fact]:
        memory.set("closed", event.closed)
        return []


class AskStillBlockedRow(Handler[StillBlocked]):
    def handle(self, event: StillBlocked, chat: Chat, memory: Remembered) -> list[Fact]:
        chat.say("still blocked", n=event.n, title=event.title, why=event.why)
        memory.set("asked", {**dict(memory.get("asked", {})), str(event.n): event.at})
        return []


class RecordEdit(Handler[EditedInWork]):
    def handle(self, event: EditedInWork, agents: Rows[AgentRow], works: Rows[Work], elsewhere: Elsewhere, git: Git) -> list[Fact]:
        tracker.record_edit(agents.load(event.agent), elsewhere.here().record, works.load(event.work), event, git)
        return []


class NameRepeatedChecks(Handler[PollingNamed]):
    def handle(self, event: PollingNamed, chat: Chat) -> list[Fact]:
        chat.nudge(POLLING if event.wakes else POLLING_NO_WAKE, times=event.times, command=event.command)
        return []


class ClearWait(Handler[WaitCleared]):
    def handle(self, event: WaitCleared, chat: Chat, works: Rows[Work]) -> list[Fact]:
        works.update(event.work, awaiting="")
        chat.nudge("wait cleared", awaiting=event.awaiting)
        return []


class AskStillAwaiting(Handler[StillAwaiting]):
    def handle(self, event: StillAwaiting, chat: Chat) -> list[Fact]:
        chat.say("still awaiting", awaiting=event.awaiting, minutes=event.minutes)
        return []


class RemindOpenWork(Handler[OpenWorkRemains]):
    def handle(self, event: OpenWorkRemains, chat: Chat, marks: Marks) -> list[Fact]:
        marks.at_most(open_reminders(event.work, event.updated))
        chat.say("open" if event.logged else "unlogged", n=event.work)
        return []


class KeepEditCount(Handler[EditsCounted]):
    def handle(self, event: EditsCounted, marks: Marks) -> list[Fact]:
        marks.write(NAME, edits=event.edits)
        return []


class NameWorkInHand(Handler[WorkNamedInHand]):
    def handle(self, event: WorkNamedInHand, chat: Chat) -> list[Fact]:
        chat.nudge("in hand", n=event.work, title=event.title)
        return []


class HoldUntilLogged(Handler[LogOverdue]):
    def handle(self, event: LogOverdue, chat: Chat) -> list[Fact]:
        chat.hold("log held", edits=event.edits, n=event.work)
        return []


class ResetEdits(Handler[LogWritten]):
    def handle(self, event: LogWritten, chat: Chat, marks: Marks) -> list[Fact]:
        marks.write(NAME, edits=0)
        chat.release()
        return []
