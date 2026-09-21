from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentUpdated, AnyEvent, ResourceEvent
from features import trigger
from features.parts import WHOLE_FEATURE, Context, Handler
from features.work_tracking import tracker
from features.work_tracking.next import next
from resources.types import Work

EDITS = "edits"
POST_TOOL_USE = "PostToolUse"


@dataclass(frozen=True)
class WorkCreated(ResourceEvent):
    on: ClassVar[str] = "work.created"


@dataclass(frozen=True)
class WorkCompleted(ResourceEvent):
    on: ClassVar[str] = "work.completed"
    todo: bool = False

    @classmethod
    def read(cls, event) -> "WorkCompleted":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, todo=bool(event.data.get(Work.todo)))


@dataclass(frozen=True)
class WorkLogged(ResourceEvent):
    on: ClassVar[str] = "work.updated"
    section: str = ""

    @classmethod
    def read(cls, event) -> "WorkLogged":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, section=str(event.data.get("section") or ""))


def working(context: Context) -> list:
    return [w for w in context.journal.works._standing() if not w.parked]


class HoldUntilDeclared(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type != "work" and (event.type, event.action) != ("agent", "created"):
            return
        if working(context):
            context.release()
        else:
            context.hold("undeclared held")


class OpenWork(Handler):
    def handle(self, context: Context, event: WorkCreated) -> None:
        tracker.begin(event, context.record)
        works = context.journal.works
        n = works.load(event.n).todo
        if not n:
            return
        todo = context.journal.todos.load(int(n))
        works.link(event.n, todo.ref)
        context.journal.todos.update(todo.n, status="started", work=event.n)


class CloseWork(Handler):
    def handle(self, context: Context, event: WorkCompleted) -> None:
        tracker.end(event, context.record)
        n = context.journal.works.load(event.n).todo
        if not n or not event.todo:
            return
        todos = context.journal.todos
        if not todos.load(int(n)).completed:
            todos.complete(int(n), how=f"work {event.n} ended")


class TrackFiles(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        row = context.agent.row if context.agent else None
        if not row or row.event != POST_TOOL_USE or not row.wrote:
            return
        for work in working(context)[:1]:
            tracker.record_files(row, context.record, work)


class RemindOpenWork(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: Context, event: AgentUpdated) -> None:
        for w in working(context)[:1]:
            context.agent.say("open" if w.sections else "unlogged", n=w.n)


class CountEdits(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        work = working(context)[:1]
        if not context.agent or not context.agent.row.wrote or not work:
            return
        row, name = context.agent.row, context.feature.name
        edits = int(trigger.last(context.record, row.title, name).get(EDITS) or 0) + 1
        trigger.write(context.record, row, name, **{EDITS: edits})
        every = context.settings.said_after
        if every and edits % every == 0:
            context.agent.whisper("in hand", n=work[0].n, title=work[0].title)
        if edits >= context.settings.log_after:
            context.hold("log held", edits=edits, n=work[0].n)


class ResetEditsOnLog(Handler):
    def handle(self, context: Context, event: WorkLogged) -> None:
        if not event.section:
            return
        for row in context.feature.live(context.record):
            trigger.write(context.record, row, context.feature.name, **{EDITS: 0})
        context.release()


class OfferNextRow(Handler):
    behaviour = "auto"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        if working(context):
            return
        row = next(context.record)
        if row:
            context.agent.say("next", n=row.n)
