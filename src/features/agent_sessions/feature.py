from events.agent_sessions import (AssignmentLapsed, CompactionStarted, EvictionLifted, ReportHandedBack, ReportNoticed, SessionEnded, SessionEvicted, SilenceDue,
                                   StopAsked, SubagentAlive, SubagentReportLinked, TakeOverChosen)
from events.agents import AgentChanged, AgentReported, ClockTicked
from events.questions import QuestionCompleted
from events.resources import ResourceCreated
from events.todos import TodoUpdated
from expects import WHEN, Dispatches, Given, Held, Nudged, Ran, Released, Updated, nothing
from framework.due import DueOnClock
from features.agent_sessions.details import AgentSessionsDetails
from features.agent_sessions.handlers import (AskToStop, ClearLapsedAssignment, HandBackReport, HoldEvicted, KeepSubagentAlive, LinkReportToSubagent, NoticeReport,
                                              RecordCompaction, ReleaseEvicted, StopEndedSession, TakeOverOnAnswer)
from features.agent_sessions.listeners import (SpotCompaction, SpotEndedSessions, SpotEviction, SpotLapsedAssignments, SpotLapsedAssignmentsOnChange, SpotReportedTodo,
                                               SpotSilentSessions, SpotStopAsked, SpotSubagentAlive, SpotSubagentReport, SpotTakeOver)
from framework.base import Feature
from framework.journal import Journal
from serving import SERVED, Providers
from resources.types import AgentRow, Environment, Question, Todo

WORKING = AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse"})
QUIET = AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "at": WHEN - 86_400})
SUBAGENT = AgentRow(n=2, title="sub-1", data={"status": "subagent", "dispatcher": "claude-1", "active": WHEN - 86_400})
HELD = Todo(n=4, title="the build", data={"assigned": "sub-1"})
STOPPING = AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "working", "stopping": {"task": "t1", "at": 5, "description": "the build"}})
REPORTED = Todo(n=4, title="the build", data={"reported": {"agent": "sub-1", "dispatcher": "claude-1", "how": "fixed"}})
ENDED_SUBAGENT = AgentRow(n=1, data={"subagent_rows": [{"id": "a1", "ended": WHEN - 10}]})
SEVERAL_SUBAGENTS = AgentRow(n=1, data={"subagent_rows": [{"id": "use-old", "ended": WHEN - 7200}, {"id": "use-1", "ended": WHEN - 60},
                                                          {"id": "use-0", "ended": WHEN - 120}, {"id": "use-2", "ended": 0.0}]})
EVICTED = "environment 'work' was claimed by session claude-2 (it asked): switch to another, or claim it back"
LAPSED = [
    Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1"), SUBAGENT, HELD]) >> Dispatches(AssignmentLapsed(agent=1, todo=4, who="sub-1", minutes=20)),
    Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1"), AgentRow(n=2, title="sub-1", data={"status": "subagent", "dispatcher": "claude-1", "active": WHEN}), HELD])
        >> Dispatches(nothing),
]


class AgentSessions(Feature):
    details = AgentSessionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentReported, SpotEviction(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(EvictionLifted(agent=1)),
        ])
        journal.events.listen(QuestionCompleted, SpotTakeOver(), expects=[
            Given(QuestionCompleted(n=3), rows=[Question(n=3, title="take it over?")]) >> Dispatches(nothing),
        ])
        journal.events.listen(ClockTicked, DueOnClock(SilenceDue, "liveness"), expects=[
            Given(ClockTicked(agent=1)) >> Dispatches(SilenceDue(agent=1).due("liveness")),
        ])
        journal.events.listen(SilenceDue, SpotSilentSessions(), expects=[
            Given(SilenceDue(agent=1), rows=[QUIET]) >> Dispatches(SessionEnded(row=1)),
            Given(SilenceDue(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "at": WHEN})]) >> Dispatches(nothing),
            Given(SilenceDue(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "stopped", "event": "Stop", "at": WHEN - 86_400})]) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotEndedSessions(), expects=[
            Given(AgentReported(agent=2, hook="SessionStart", session="claude-2"), rows=[WORKING, AgentRow(n=2, title="claude-2", data={"status": "working"})]) >> Dispatches(SessionEnded(row=1)),
            Given(AgentReported(agent=2, hook="PostToolUse", session="claude-2"), rows=[WORKING, AgentRow(n=2, title="claude-2", data={"status": "working"})]) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotCompaction(), expects=[
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "compacting"})]) >> Dispatches(CompactionStarted(agent=1, at=WHEN)),
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "compacting", "compactions": [{"at": WHEN - 30}]})]) >> Dispatches(nothing),
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "working"})]) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentChanged, SpotStopAsked(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[STOPPING])
                >> Dispatches(StopAsked(agent=1, task="t1", description="the build", how="run TaskStop with task_id t1 now").once("1:t1|5")),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "working"})]) >> Dispatches(nothing),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "stopped", "stopping": {"task": "b8old", "at": 6, "description": "An old poll"}})])
                >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotSubagentAlive(), expects=[
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=2, title="sub-1"), Todo(n=4, title="the build", data={"agent": "sub-1", "dispatcher": "claude-1"})])
                >> Dispatches(SubagentAlive(session="sub-1", dispatcher="claude-1", at=WHEN)),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=2, title="sub-1"), Todo(n=4, title="the build")]) >> Dispatches(nothing),
            Given(ResourceCreated(n=2, type="agent", actor="system"), rows=[AgentRow(n=2, title="sub-1")]) >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotSubagentReport(), expects=[
            Given(ResourceCreated(n=5, type="report", actor="agent"), rows=[ENDED_SUBAGENT]) >> Dispatches(SubagentReportLinked(agent=1, reports=(("a1", 5),))),
            Given(ResourceCreated(n=5, type="report", actor="user"), rows=[ENDED_SUBAGENT]) >> Dispatches(nothing),
            Given(ResourceCreated(n=5, type="report", actor="agent"), rows=[AgentRow(n=1)]) >> Dispatches(nothing),
            Given(ResourceCreated(n=5, type="report", actor="agent"), rows=[SEVERAL_SUBAGENTS]) >> Dispatches(SubagentReportLinked(agent=1, reports=(("use-1", 5),))),
        ])
        journal.events.listen(TodoUpdated, SpotReportedTodo(), expects=[
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), REPORTED]) >> Dispatches(ReportNoticed(todo=4)) & Dispatches(ReportHandedBack(agent=1, todo=4, who="sub-1", how="fixed")),
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), Todo(n=4, title="the build", data={"reported": {"agent": "sub-1", "dispatcher": "claude-1", "notified": True}})])
                >> Dispatches(nothing),
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), Todo(n=4, title="the build")]) >> Dispatches(nothing),
        ])
        journal.events.listen(ClockTicked, SpotLapsedAssignments(), expects=LAPSED)
        journal.events.listen(AgentChanged, SpotLapsedAssignmentsOnChange(), expects=[
            Given(AgentChanged(agent=2, action="updated"), rows=[AgentRow(n=1, title="claude-1"), SUBAGENT, HELD]) >> Dispatches(AssignmentLapsed(agent=1, todo=4, who="sub-1", minutes=20)),
            Given(AgentChanged(agent=2, action="created"), rows=[AgentRow(n=1, title="claude-1"), SUBAGENT, HELD]) >> Dispatches(nothing),
        ])
        journal.events.handle(SessionEvicted, HoldEvicted(), expects=[
            Given(SessionEvicted(agent=1, environment="'work'", by="claude-2", why="it asked"), rows=[AgentRow(n=1, title="claude-1")]) >> Held(EVICTED),
        ])
        journal.events.handle(EvictionLifted, ReleaseEvicted(), expects=[
            Given(EvictionLifted(agent=1), rows=[AgentRow(n=1, title="claude-1")], held=EVICTED, held_under="eviction") >> Released(),
        ])
        journal.events.handle(TakeOverChosen, TakeOverOnAnswer(), expects=[
            Given(TakeOverChosen(session="claude-2", environment="t", place=1), rows=[Environment(n=1, title="t")]) >> Updated(Environment(n=1), holder="claude-2"),
        ])
        journal.events.handle(SessionEnded, StopEndedSession(), expects=[
            Given(SessionEnded(row=1), rows=[QUIET]) >> Updated(AgentRow(n=1), status="stopped"),
        ])
        journal.events.handle(CompactionStarted, RecordCompaction(), expects=[
            Given(CompactionStarted(agent=1, at=WHEN), rows=[AgentRow(n=1, data={"status": "compacting"})]) >> Updated(AgentRow(n=1), compactions=[{"at": WHEN}]),
        ])
        journal.events.handle(StopAsked, AskToStop(), expects=[
            Given(StopAsked(agent=1, task="t1", description="the build", how="stop it"), rows=[STOPPING]) >> Nudged("stop", description="the build"),
            Given(StopAsked(agent=1, task="b7wu1410l", description="Poll production", how="run TaskStop with task_id b7wu1410l now"), rows=[STOPPING])
                >> Nudged("stop", description="Poll production", how="run TaskStop with task_id b7wu1410l now; then carry on with the work"),
        ])
        journal.events.handle(SubagentAlive, KeepSubagentAlive(), expects=[
            Given(SubagentAlive(session="sub-1", dispatcher="claude-1", at=WHEN), rows=[AgentRow(n=2, title="sub-1")]) >> Updated(AgentRow(n=2), status="subagent", dispatcher="claude-1", active=WHEN),
        ])
        journal.events.handle(SubagentReportLinked, LinkReportToSubagent(), expects=[
            Given(SubagentReportLinked(agent=1, reports=(("a1", 5),)), rows=[ENDED_SUBAGENT]) >> Updated(AgentRow(n=1), subagent_reports={"a1": 5}),
        ])
        journal.events.handle(ReportNoticed, NoticeReport(), expects=[
            Given(ReportNoticed(todo=4), rows=[REPORTED]) >> Updated(Todo(n=4), reported={"notified": True}),
        ])
        journal.events.handle(ReportHandedBack, HandBackReport(), expects=[
            Given(ReportHandedBack(agent=1, todo=4, who="sub-1", how="fixed"), rows=[AgentRow(n=1, title="claude-1"), REPORTED]) >> Nudged("reported", who="sub-1", n=4, how="fixed"),
        ])
        journal.events.handle(AssignmentLapsed, ClearLapsedAssignment(), expects=[
            Given(AssignmentLapsed(agent=1, todo=4, who="sub-1", minutes=20), rows=[AgentRow(n=1, title="claude-1"), SUBAGENT, HELD])
                >> Updated(Todo(n=4), assigned="", lapsed="sub-1") & Nudged("lapsed", who="sub-1", n=4, minutes=20),
        ])
