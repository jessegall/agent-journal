from controllers.types import Works
from events.agents import AgentReported, ToolFinished
from events.agents import ClockTicked
from events.files import FileEdited
from events.resources import AnyEvent
from events.todos import TodoCompleted
from events.works import WorkCreated
from resources.plans import Plan
import json
from dataclasses import asdict

from expects import answering, Answered, Dispatches, Given, Held, Nudged, Refused, Remembered, Unchanged, Updated, WHEN, nothing
from events.answers import Allowed, Refused as Declined
from events.asking import ToolCallAsked
from events.work_tracking import (ClosedCounted, EditedInWork, EditsCounted, LogOverdue, LogWritten, OpenWorkRemains, ParkedWorkStands, PollingNamed, RowUnblocked,
                                  StillAwaiting, StillBlocked, TodoDoneWithWork, TodoLeftByWork, WaitCleared, WorkDeclared, WorkFilesLetGo, WorkEndedByTodo,
                                  WorkNamedInHand, WorkTookTodo, WorkUndeclared)
from declaring.trigger import Mark
from events.plans import PlanCompleted
from events.works import WorkCompleted, WorkUpdated
from resources.base import AGENT, USER
from resources.types import AgentRow, Todo, Work
from framework.base import Feature
from framework.watched import COUNT, FACTS, Fact, state_facts
from declaring.registries import READINESS
from features.work_tracking.next import ready, says_what_is_ready
from framework.sending import Sent
from features.work_tracking.auto import automatic
from declaring.registries import SUMMARY_PARTS
from framework.journal import Journal
from features.work_tracking.auto import chosen_or_steered, steered
from features.work_tracking.commands import AwaitWork, LogWork, ParkWork, ResumeWork
from features.work_tracking.details import CHECK_IN, WorkDetails
from framework.sending import Cap, Nudge
from features.work_tracking.nudges import CARRY_ON_TIMES, check_in_pace, next_row, nothing_happening, nothing_ready, stopped_in_auto, stopped_with_work, next_while_helping, working
from features.work_tracking.answering import RefuseHeldCalls, RefuseWaitingInTheShell
from features.work_tracking.waiting import WAIT_WAY
from features.work_tracking.handlers import (AskStillAwaiting, AskStillBlockedRow, ClearWait, CompleteTodoWithWork, EndWorkOfTodo, HoldUntilDeclared,
                                             HoldUntilLogged, KeepClosedCount, KeepEditCount, LeaveTodoByWork, LinkTodoToWork, NameParkedWork, NameRepeatedChecks,
                                             LetGoOfWorkFiles, NameUnblockedRow, NameWorkInHand, RecordEdit, ReleaseOnceDeclared, RemindOpenWork, ResetEdits)
from features.work_tracking.listeners import (SpotBlockedRows, SpotDeclaring, SpotEditedFile, SpotEdits, SpotLogEntry, SpotOpenWork, SpotParkedWork, SpotPolling,
                                              SpotStillAwaiting, SpotUnblockedByPlan, SpotUnblockedByTodo, SpotWaitCleared, SpotWorkEnded, SpotWorkOfDoneTodo, SpotWorkOpened)
NOTHING_OPEN = 'nothing is open, so this write would not be filed: journal work start "<the work>" first'

AGENT_ROW = AgentRow(n=1, title="claude-1")
CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
LOG_HELD = "log held: twenty edits without a log entry"
EDITING = ToolCallAsked(tool="Edit", input=json.dumps({"file_path": "src/app.py", "new_string": "x"}, sort_keys=True), session="claude-1", paths=("src/app.py",), writes=True)
AFTER_NINE_EDITS = {".journal/runtime/sessions/claude-1/trigger-work_tracking.json": json.dumps(asdict(Mark(edits=9)))}
WAITING = Work(n=3, title="Wait on the build", data={"awaiting": "the build"})
PARKED = Work(n=3, title="Write the report", data={"parked": "the user asked for something first"})

WORKING = Work(n=3, title="Write the report")
OPEN = Work(n=3, title="Write the report", updated=5.0)
WAITED = int((WHEN - 1.0) // 60)
typing = AgentRow(n=1, title="claude-1", data={"wrote": True})
polling = AgentRow(n=1, title="claude-1", data={"commands": [{"tool": "Bash", "command": "git status"}] * 3})
varying = AgentRow(n=1, title="claude-1", data={"commands": [{"tool": "Bash", "command": c} for c in ("git status", "git log", "git status")]})

OPENED = WorkCreated(n=3, type="work", action="created", actor=AGENT)
ENDED_WITH_TODO = WorkCompleted(n=3, type="work", action="completed", actor=AGENT, todo=True)
ENDED_ALONE = WorkCompleted(n=3, type="work", action="completed", actor=AGENT, todo=False)
ON_TODO = Work(n=3, title="Fix the crash", data={"todo": 5})
ENDED_ON_TODO = Work(n=3, title="Fix the crash", completed=2.0, data={"todo": 5})
STARTED_TODO = Todo(n=5, title="Fix the crash", data={"status": "started"})
ran = AgentRow(n=1, title="claude-1", data={"commands": [{"tool": "Bash", "command": "ls", "at": 10.0, "done": 11.0}]})


class ChangesOnly:
    def __init__(self, *paths: str) -> None:
        self.paths = list(paths)

    def __eq__(self, changed: list) -> bool:
        return [change["path"] for change in changed] == self.paths


def edited(path: str, before: str, after: str) -> FileEdited:
    return FileEdited(agent=1, path=path, kind="edited", before=before, after=after, added=1, removed=0)


class LoggedAs:
    def __init__(self, text: str) -> None:
        self.text = text

    def __eq__(self, sections: list) -> bool:
        return any(section["body"] == self.text for section in sections)


def shell(command: str, **given) -> ToolCallAsked:
    return ToolCallAsked(tool="Bash", input=command, command=command, session="claude-1", background=bool(given.get("run_in_background")))


def open_work(context) -> list:
    return working(context)


def todo_ready(context, agent, over: float) -> list[Sent]:
    rows = ready(context.record)
    if open_work(context) or len(rows) < over:
        return []
    return [Sent("ready", {"n": rows[0].n, "title": rows[0].title, "count": len(rows)})]


class WorkFeature(Feature):
    details = WorkDetails
    nudges = (Nudge("next", behaviour="auto", about=next_row(standing=False), private=False, cap=Cap(1),
                    guarantee="With auto mode on and no work in hand, the agent is offered the next to-do that is ready."),
              Nudge("next while waiting", behaviour="auto", about=next_row(standing=True), private=False, cap=Cap(1),
                    guarantee="When the work in hand is waiting on something, the agent is offered the next ready to-do rather than sitting out the wait."),
              Nudge("next while a helper works", behaviour="auto", about=next_while_helping, private=False, cap=Cap(1),
                    guarantee="When the work in hand waits on a helper, the agent is offered the next ready to-do instead of waiting for it."),
              Nudge("carry on", behaviour="carry on", about=stopped_with_work, once=True,
                    guarantee="When the agent stops with work still in hand, it is asked once to carry on with it."),
              Nudge("auto carry on", behaviour="carry on", about=stopped_in_auto, cap=Cap(CARRY_ON_TIMES),
                    guarantee="With auto mode on, an agent that stops while the user has been quiet is told to carry on, a few times."),
              Nudge("nothing ready", behaviour="nothing ready", about=nothing_ready, cap=Cap(CARRY_ON_TIMES),
                    guarantee="When every open row is waiting on something, the agent is told there is nothing ready to take."),
              Nudge(CHECK_IN, behaviour=CHECK_IN, about=nothing_happening, pace=check_in_pace,
                    guarantee="When nothing has happened for the check-in interval, the agent is asked whether anything is left to do and told what this environment holds, whether or not it has work in hand."))

    def chosen(self, record, key: str) -> bool:
        return chosen_or_steered(super().chosen(record, key), record, key)

    def settings_view(self, record) -> dict:
        return {**super().settings_view(record), "steered": steered(record)}

    def register(self, journal: Journal) -> None:
        READINESS.add(None, says_what_is_ready)
        SUMMARY_PARTS.add(None, automatic, key="auto")
        FACTS.register(self, *state_facts("work", "open", open_work), *state_facts("work", "awaiting", lambda context: [work for work in open_work(context) if work.awaiting]),
                       Fact("todo.ready", COUNT, "To-dos are ready and no work is open", "at least {over} to-dos are ready and no work is open", todo_ready,
                            fills=("n", "title", COUNT)))
        journal.commands.add("work", LogWork(), expects=[
            Given((Works, "Chose the retry over the timeout"), rows=[WORKING]) >> Updated(Work(n=3), sections=LoggedAs("Chose the retry over the timeout")),
            Given((Works,), rows=[WORKING]) >> Refused('say what was decided or done: journal work log <n> "<text>"'),
            Given((Works, "Chose the retry"), rows=[]) >> Refused('nothing is open: journal work start "<the work>" first'),
            Given((Works, "3", "Chose the retry"), rows=[PARKED]) >> Refused("work 3 is parked; the one in hand is what a log entry means"),
        ])
        journal.commands.add("work", ParkWork(), expects=[
            Given((Works, "the user asked for something first"), rows=[WAITING]) >> Updated(Work(n=3), parked="the user asked for something first", awaiting=""),
            Given((Works,), rows=[WORKING]) >> Refused('say why it waits: journal work park <n> "<why>"'),
            Given((Works, "later"), rows=[]) >> Refused('nothing is open: journal work start "<the work>" first'),
        ])
        journal.commands.add("work", ResumeWork(), expects=[
            Given((Works, 3), rows=[PARKED]) >> Updated(Work(n=3), parked=""),
            Given((Works, 3), rows=[WORKING]) >> Refused("work 3 is not parked"),
            Given((Works, 3), rows=[PARKED, Work(n=4, title="Something else")]) >> Refused('work 4 is open: end it with journal work end --how "<what landed>", or set it aside with journal work park "<why>", before starting another'),
        ])
        journal.commands.add("work", AwaitWork(), expects=[
            Given((Works, "the build"), rows=[WORKING]) >> Updated(Work(n=3), awaiting="the build"),
            Given((Works, "the build"), rows=[]) >> Updated(Work(n=1), awaiting="the build"),
            Given((Works, "the user to answer"), rows=[WORKING]) >> Refused("waiting for the user is being idle, not waiting: a wait is for something that will happen on its own and let the work go on. Put the question on its row with journal todo ask and take the next ready row, or end your turn"),
            Given((Works,), rows=[WORKING]) >> Refused('say what you are waiting for: journal work await <n> "<what>"'),
        ])
        journal.events.listen(AnyEvent, SpotDeclaring(), expects=[
            Given(AnyEvent(n=1, type="agent", action="created", actor=USER), rows=[AGENT_ROW]) >> Dispatches(WorkUndeclared()),
            Given(AnyEvent(n=1, type="agent", action="created", actor=USER), rows=[AGENT_ROW, WORKING]) >> Dispatches(WorkDeclared()),
            Given(AnyEvent(n=1, type="agent", action="created", actor=USER), rows=[AGENT_ROW, PARKED]) >> Dispatches(WorkUndeclared()),
            Given(AnyEvent(n=3, type="work", action="created", actor=AGENT), rows=[AGENT_ROW]) >> Dispatches(WorkUndeclared()),
            Given(AnyEvent(n=1, type="todo", action="created", actor=USER), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.listen(WorkCreated, SpotWorkOpened(), expects=[
            Given(OPENED, rows=[ON_TODO, Todo(n=5, title="Fix the crash")]) >> Dispatches(WorkFilesLetGo(work=3)) & Dispatches(WorkTookTodo(work=3, todo=5)),
            Given(OPENED, rows=[Work(n=3, title="Look around"), Todo(n=5, title="Fix the crash")]) >> Dispatches(WorkFilesLetGo(work=3)),
        ])
        journal.events.listen(WorkCompleted, SpotWorkEnded(), expects=[
            Given(ENDED_WITH_TODO, rows=[ENDED_ON_TODO, STARTED_TODO]) >> Dispatches(WorkFilesLetGo(work=3)) & Dispatches(TodoDoneWithWork(work=3, todo=5)),
            Given(ENDED_ALONE, rows=[ENDED_ON_TODO, STARTED_TODO]) >> Dispatches(TodoLeftByWork(todo=5)),
            Given(ENDED_WITH_TODO, rows=[ENDED_ON_TODO, Todo(n=5, title="Fix the crash", completed=1.0)]) >> Dispatches(WorkFilesLetGo(work=3)),
            Given(ENDED_WITH_TODO, rows=[Work(n=3, title="Look around", completed=2.0)]) >> Dispatches(WorkFilesLetGo(work=3)),
            Given(ENDED_ALONE, rows=[Work(n=3, title="Look around", completed=2.0), Work(n=4, title="Write the report", data={"parked": "the user asked for something first"}), AGENT_ROW])
                >> Dispatches(WorkFilesLetGo(work=3)) & Dispatches(ParkedWorkStands(agent=1, work=4, title="Write the report", why="the user asked for something first", more="",
                                                                                    parkings=("4:the user asked for something first",))),
        ])
        journal.events.listen(TodoCompleted, SpotParkedWork(), expects=[
            Given(TodoCompleted.of(9), rows=[Todo(n=9, title="Done", completed=1.0), PARKED, AGENT_ROW])
                >> Dispatches(ParkedWorkStands(agent=1, work=3, title="Write the report", why="the user asked for something first", more="",
                                               parkings=("3:the user asked for something first",))),
            Given(TodoCompleted.of(9), rows=[Todo(n=9, title="Done", completed=1.0), Todo(n=4, title="Next"), PARKED, AGENT_ROW]) >> Dispatches(nothing),
            Given(TodoCompleted.of(9), rows=[Todo(n=9, title="Done", completed=1.0), PARKED]) >> Dispatches(nothing),
            Given(TodoCompleted.of(9), rows=[Todo(n=9, title="Done", completed=1.0), Work(n=3, title="Work", data={"todo": 9, "parked": "later"}), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.listen(TodoCompleted, SpotUnblockedByTodo(), expects=[
            Given(TodoCompleted.of(7), rows=[Todo(n=7, title="First", completed=1.0), Todo(n=8, title="Then", data={"after": ["todo:7"]}), AGENT_ROW])
                >> Dispatches(RowUnblocked(agent=1, n=8, title="Then", closed="todo 7")),
            Given(TodoCompleted.of(7), rows=[Todo(n=7, title="First", completed=1.0), Todo(n=8, title="Then", data={"after": ["todo:7", "todo:9"]}), Todo(n=9, title="Other"), AGENT_ROW])
                >> Dispatches(nothing),
            Given(TodoCompleted.of(7), rows=[Todo(n=7, title="First", completed=1.0, data={"struck": "not needed"}), Todo(n=8, title="Then", data={"after": ["todo:7"]}), AGENT_ROW])
                >> Dispatches(nothing),
            Given(TodoCompleted.of(7), rows=[Todo(n=7, title="First", completed=1.0), Todo(n=8, title="Then", data={"after": ["todo:7"]})]) >> Dispatches(nothing),
        ])
        journal.events.listen(PlanCompleted, SpotUnblockedByPlan(), expects=[
            Given(PlanCompleted(n=2, type="plan", action="completed", actor=USER),
                  rows=[Plan(n=2, title="Ship it", completed=1.0, data={"status": "done"}), Todo(n=8, title="Then", data={"after": ["plan:2"]}), AGENT_ROW])
                >> Dispatches(RowUnblocked(agent=1, n=8, title="Then", closed="plan 2")),
            Given(PlanCompleted(n=2, type="plan", action="completed", actor=USER), rows=[Plan(n=2, title="Ship it"), Todo(n=8, title="Then", data={"after": ["plan:2"]}), AGENT_ROW])
                >> Dispatches(nothing),
        ])
        journal.events.listen(TodoCompleted, SpotBlockedRows(), expects=[
            Given(TodoCompleted.of(7), rows=[Todo(n=8, title="Deploy", data={"blocked": "waiting on the key"}), AGENT_ROW], settings={"work_tracking.ask_blocked_every": 1})
                >> Dispatches(ClosedCounted(closed=1)) & Dispatches(StillBlocked(agent=1, n=8, title="Deploy", why="waiting on the key", at=WHEN)),
            Given(TodoCompleted.of(7), rows=[Todo(n=8, title="Deploy", data={"blocked": "waiting on the key"}), AGENT_ROW], settings={"work_tracking.ask_blocked_every": 2})
                >> Dispatches(ClosedCounted(closed=1)),
            Given(TodoCompleted.of(7), rows=[Todo(n=8, title="Deploy"), AGENT_ROW], settings={"work_tracking.ask_blocked_every": 1}) >> Dispatches(ClosedCounted(closed=1)),
            Given(TodoCompleted.of(7), rows=[Todo(n=8, title="Deploy", data={"blocked": "waiting on the key"})], settings={"work_tracking.ask_blocked_every": 1})
                >> Dispatches(ClosedCounted(closed=1)),
        ])
        journal.events.listen(TodoCompleted, SpotWorkOfDoneTodo(), expects=[
            Given(TodoCompleted.of(5), rows=[Todo(n=5, title="Fix the crash", completed=1.0), ON_TODO]) >> Dispatches(WorkEndedByTodo(work=3, how="todo 5 done")),
            Given(TodoCompleted.of(9), rows=[Todo(n=9, title="Other", completed=1.0), ON_TODO]) >> Dispatches(nothing),
        ])
        journal.events.listen(FileEdited, SpotEditedFile(), expects=[
            Given(edited("src/app.py", "a\n", "a\nb\n"), rows=[WORKING, AGENT_ROW])
                >> Dispatches(EditedInWork(agent=1, work=3, path="src/app.py", kind="edited", before="a\n", after="a\nb\n", added=1, removed=0)),
            Given(edited("src/app.py", "a\n", "a\nb\n"), rows=[PARKED, AGENT_ROW]) >> Dispatches(nothing),
            Given(edited("src/app.py", "a\n", "a\nb\n"), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolFinished, SpotPolling(), expects=[
            Given(ToolFinished(agent=1), rows=[polling]) >> Dispatches(PollingNamed(agent=1, times=3, command="git status", wakes=False).once("1:git status")),
            Given(ToolFinished(agent=1), rows=[varying]) >> Dispatches(nothing),
            Given(ToolFinished(agent=1), rows=[polling, WAITING]) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolFinished, SpotWaitCleared(), expects=[
            Given(ToolFinished(agent=1), rows=[Work(n=3, title="Wait on the build", data={"awaiting": "the build", "awaiting_since": 5.0}), ran])
                >> Dispatches(WaitCleared(agent=1, work=3, awaiting="the build")),
            Given(ToolFinished(agent=1), rows=[Work(n=3, title="Wait on the build", data={"awaiting": "the build", "awaiting_since": 20.0}), ran]) >> Dispatches(nothing),
            Given(ToolFinished(agent=1), rows=[Work(n=3, title="Wait on the helper", data={"awaiting": "the helper", "awaiting_on": "helper:2", "awaiting_since": 5.0}), ran])
                >> Dispatches(nothing),
        ])
        journal.events.listen(ClockTicked, SpotStillAwaiting(), expects=[
            Given(ClockTicked(agent=1), rows=[Work(n=3, title="Wait on the build", data={"awaiting": "the build", "awaiting_since": 1.0}), AGENT_ROW], settings={"work_tracking.ask_awaiting_every": 5})
                >> Dispatches(StillAwaiting(agent=1, awaiting="the build", minutes=WAITED).once(f"1:3:{WAITED // 5}")),
            Given(ClockTicked(agent=1), rows=[Work(n=3, title="Wait on the helper", data={"awaiting": "the helper", "awaiting_since": 1.0, "awaiting_on": "helper:2"}), AGENT_ROW],
                  settings={"work_tracking.ask_awaiting_every": 5}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[WAITING, AGENT_ROW], settings={"work_tracking.ask_awaiting_every": 5}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Work(n=3, title="Wait on the build", data={"awaiting": "the build", "awaiting_since": 1.0}), AGENT_ROW],
                  settings={"work_tracking.ask_awaiting_every": 0}) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW], settings={"work_tracking.ask_awaiting_every": 5}) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotOpenWork(), expects=[
            Given(AgentReported(agent=1), rows=[OPEN, AGENT_ROW]) >> Dispatches(OpenWorkRemains(agent=1, work=3, updated=5.0, logged=False).due()),
            Given(AgentReported(agent=1), rows=[Work(n=3, title="Write the report", updated=5.0, sections=[{"title": "1", "body": "started"}]), AGENT_ROW])
                >> Dispatches(OpenWorkRemains(agent=1, work=3, updated=5.0, logged=True).due()),
            Given(AgentReported(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[PARKED, AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolFinished, SpotEdits(), expects=[
            Given(ToolFinished(agent=1), rows=[WORKING, typing], settings={"work_tracking.name_work_every": 1})
                >> Dispatches(EditsCounted(agent=1, edits=1)) & Dispatches(WorkNamedInHand(agent=1, work=3, title="Write the report")),
            Given(ToolFinished(agent=1), rows=[WORKING, typing], settings={"work_tracking.name_work_every": 5}) >> Dispatches(EditsCounted(agent=1, edits=1)),
            Given(ToolFinished(agent=1), rows=[WORKING, typing], settings={"work_tracking.log_after": 10}, files=answering(AFTER_NINE_EDITS))
                >> Dispatches(EditsCounted(agent=1, edits=10)) & Dispatches(LogOverdue(agent=1, work=3, edits=10)),
            Given(ToolFinished(agent=1), rows=[WORKING, AGENT_ROW], settings={"work_tracking.name_work_every": 1}) >> Dispatches(nothing),
            Given(ToolFinished(agent=1), rows=[typing], settings={"work_tracking.name_work_every": 1}) >> Dispatches(nothing),
        ])
        journal.events.listen(WorkUpdated, SpotLogEntry(), expects=[
            Given(WorkUpdated(n=3, type="work", action="updated", actor=AGENT, section="1 · now"), rows=[WORKING, AGENT_ROW]) >> Dispatches(LogWritten(agent=1)),
            Given(WorkUpdated(n=3, type="work", action="updated", actor=AGENT), rows=[WORKING, AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(WorkUndeclared, HoldUntilDeclared(), expects=[
            Given(WorkUndeclared(), rows=[AGENT_ROW]) >> Held(NOTHING_OPEN),
        ])
        journal.events.handle(WorkDeclared, ReleaseOnceDeclared(), expects=[
            Given(WorkDeclared(), rows=[AGENT_ROW, WORKING], held=NOTHING_OPEN) >> Dispatches(nothing),
        ])
        journal.events.handle(WorkFilesLetGo, LetGoOfWorkFiles(), expects=[
            Given(WorkFilesLetGo(work=3), rows=[WORKING]) >> Dispatches(nothing),
            Given(WorkFilesLetGo(work=3), rows=[ENDED_ON_TODO]) >> Dispatches(nothing),
        ])
        journal.events.handle(WorkTookTodo, LinkTodoToWork(), expects=[
            Given(WorkTookTodo(work=3, todo=5), rows=[ON_TODO, Todo(n=5, title="Fix the crash")]) >> Updated(Todo(n=5), status="started", work=3),
        ])
        journal.events.handle(TodoDoneWithWork, CompleteTodoWithWork(), expects=[
            Given(TodoDoneWithWork(work=3, todo=5), rows=[ENDED_ON_TODO, STARTED_TODO]) >> Updated(Todo(n=5), outcome="work 3 ended"),
        ])
        journal.events.handle(TodoLeftByWork, LeaveTodoByWork(), expects=[
            Given(TodoLeftByWork(todo=5), rows=[ENDED_ON_TODO, STARTED_TODO]) >> Updated(Todo(n=5), status=""),
        ])
        journal.events.handle(WorkEndedByTodo, EndWorkOfTodo(), expects=[
            Given(WorkEndedByTodo(work=3, how="todo 5 done"), rows=[Todo(n=5, title="Fix the crash", completed=1.0), ON_TODO]) >> Updated(Work(n=3), outcome="todo 5 done"),
        ])
        journal.events.handle(ParkedWorkStands, NameParkedWork(), expects=[
            Given(ParkedWorkStands(agent=1, work=3, title="Write the report", why="the user asked for something first", more="", parkings=("3:the user asked for something first",)),
                  rows=[PARKED, AGENT_ROW]) >> Nudged("parked") & Remembered("named_parked", ["3:the user asked for something first"]),
        ])
        journal.events.handle(RowUnblocked, NameUnblockedRow(), expects=[
            Given(RowUnblocked(agent=1, n=8, title="Then", closed="todo 7"), rows=[AGENT_ROW]) >> Nudged("unblocked"),
        ])
        journal.events.handle(ClosedCounted, KeepClosedCount(), expects=[
            Given(ClosedCounted(closed=4), rows=[AGENT_ROW]) >> Remembered("closed", 4),
        ])
        journal.events.handle(StillBlocked, AskStillBlockedRow(), expects=[
            Given(StillBlocked(agent=1, n=8, title="Deploy", why="waiting on the key", at=WHEN), rows=[AGENT_ROW]) >> Nudged("still blocked") & Remembered("asked", {"8": WHEN}),
        ])
        journal.events.handle(EditedInWork, RecordEdit(), expects=[
            Given(EditedInWork(agent=1, work=3, path="src/app.py", kind="edited", before="a\n", after="a\nb\n", added=1, removed=0), rows=[WORKING, AGENT_ROW])
                >> Updated(Work(n=3), changed=ChangesOnly("src/app.py")),
            Given(EditedInWork(agent=1, work=3, path="src/app.py", kind="edited", before="a\n", after="a\n", added=0, removed=0), rows=[WORKING, AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handle(PollingNamed, NameRepeatedChecks(), expects=[
            Given(PollingNamed(agent=1, times=3, command="git status", wakes=False), rows=[AGENT_ROW]) >> Nudged("polling, no wake"),
            Given(PollingNamed(agent=1, times=3, command="git status", wakes=True), rows=[AGENT_ROW]) >> Nudged("polling"),
        ])
        journal.events.handle(WaitCleared, ClearWait(), expects=[
            Given(WaitCleared(agent=1, work=3, awaiting="the build"), rows=[WAITING, AGENT_ROW]) >> Updated(Work(n=3), awaiting="") & Nudged("wait cleared"),
        ])
        journal.events.handle(StillAwaiting, AskStillAwaiting(), expects=[
            Given(StillAwaiting(agent=1, awaiting="the build", minutes=7), rows=[WAITING, AGENT_ROW]) >> Nudged("still awaiting"),
        ])
        journal.events.handle(OpenWorkRemains, RemindOpenWork(), expects=[
            Given(OpenWorkRemains(agent=1, work=3, updated=5.0, logged=False), rows=[WORKING, AGENT_ROW]) >> Nudged("unlogged"),
            Given(OpenWorkRemains(agent=1, work=3, updated=5.0, logged=True), rows=[WORKING, AGENT_ROW]) >> Nudged("open"),
        ])
        journal.events.handle(EditsCounted, KeepEditCount(), expects=[
            Given(EditsCounted(agent=1, edits=3), rows=[WORKING, AGENT_ROW]) >> Remembered("trigger-work_tracking", asdict(Mark(edits=3))),
        ])
        journal.events.handle(WorkNamedInHand, NameWorkInHand(), expects=[
            Given(WorkNamedInHand(agent=1, work=3, title="Write the report"), rows=[WORKING, AGENT_ROW]) >> Nudged("in hand"),
        ])
        journal.events.handle(LogOverdue, HoldUntilLogged(), expects=[
            Given(LogOverdue(agent=1, work=3, edits=20), rows=[WORKING, AGENT_ROW])
                >> Held('20 edits since work 3 was last logged: journal work log "<what was decided or done, and why>" before any other write'),
        ])
        journal.events.handle(LogWritten, ResetEdits(), expects=[
            Given(LogWritten(agent=1), rows=[WORKING, AGENT_ROW], files=answering(AFTER_NINE_EDITS)) >> Remembered("trigger-work_tracking", asdict(Mark(edits=0))),
        ])
        journal.events.answer(ToolCallAsked, RefuseHeldCalls(), expects=[
            Given(EDITING, rows=[CLAUDE], held=LOG_HELD) >> Answered(Declined(LOG_HELD)),
            Given(shell("ls src"), rows=[CLAUDE], held=LOG_HELD) >> Answered(Allowed()),
            Given(EDITING, rows=[CLAUDE]) >> Answered(Allowed()),
        ])
        journal.events.answer(ToolCallAsked, RefuseWaitingInTheShell(), expects=[
            Given(shell("sleep 30")) >> Answered(Declined(WAIT_WAY)),
            Given(shell("until test -f done; do sleep 1; done")) >> Answered(Declined(WAIT_WAY)),
            Given(shell("sleep 30", run_in_background=True)) >> Answered(Allowed()),
            Given(shell("sleep 5; echo hi")) >> Answered(Allowed()),
            Given(shell("git status")) >> Answered(Allowed()),
        ])
