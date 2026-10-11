from features.agent_sessions.details import AgentSessionsDetails
from features.agent_sessions.handlers import TodoUpdated, AskToStop, ClearLapsedAssignments, ClearLapsedAssignmentsOnChange, HandBackReport, HoldEvicted, KeepSubagentAlive, LinkReportToSubagent, MarkSilentStopped, RecordCompactions, StopEndedAtSessionStart, TakeOverOnAnswer
from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from engine.events.resources import AgentChanged, QuestionAnswered, ResourceCreated
from expects import Given, Nudged, Unchanged, Updated
from features.base import Feature
from features.journal import Journal
from resources.types import AgentRow, Question, Todo


LAPSED = [
    Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1"), AgentRow(n=2, title="sub-1", data={"status": "subagent", "dispatcher": "claude-1", "active": 1.0}),
                                      Todo(n=4, title="the build", data={"assigned": "sub-1"})])
        >> Updated(Todo(n=4), assigned="") & Nudged("lapsed"),
    Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1"), AgentRow(n=2, title="sub-1", data={"status": "subagent", "dispatcher": "claude-1", "active": 9_000_000_000_000}),
                                      Todo(n=4, title="the build", data={"assigned": "sub-1"})])
        >> Unchanged(),
]


class AgentSessions(Feature):
    details = AgentSessionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(HoldEvicted(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(TakeOverOnAnswer(), expects=[
            Given(QuestionAnswered(n=3), rows=[Question(n=3, title="take it over?")]) >> Unchanged(),
        ])
        journal.events.handler(MarkSilentStopped(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "at": 1.0})])
                >> Updated(AgentRow(n=1), status="stopped"),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "at": 9_000_000_000_000})]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"status": "stopped", "event": "Stop", "at": 1.0})]) >> Unchanged(),
        ])
        journal.events.handler(StopEndedAtSessionStart(), expects=[
            Given(AgentReported(agent=2, hook="SessionStart", session="claude-2"),
                  rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse"}), AgentRow(n=2, title="claude-2", data={"status": "working"})])
                >> Updated(AgentRow(n=1), status="stopped"),
            Given(AgentReported(agent=2, hook="PostToolUse", session="claude-2"),
                  rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse"}), AgentRow(n=2, title="claude-2", data={"status": "working"})])
                >> Unchanged(),
        ])
        journal.events.handler(AskToStop(), expects=[
            Given(AgentChanged(agent=1, action="updated"),
                  rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "working", "stopping": {"task": "t1", "at": 5, "description": "the build"}})])
                >> Nudged("stop"),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude", "status": "working"})]) >> Unchanged(),
        ])
        journal.events.handler(RecordCompactions(), expects=[
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "compacting"})]) >> Updated(AgentRow(n=1), compactions=[{}]),
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "compacting", "compactions": [{"at": 9_000_000_000_000}]})]) >> Unchanged(),
            Given(AgentReported(agent=1, hook="PreCompact"), rows=[AgentRow(n=1, data={"status": "working"})]) >> Unchanged(),
        ])
        journal.events.handler(KeepSubagentAlive(), expects=[
            Given(ResourceCreated(n=4, type="todo", actor="agent"),
                  rows=[AgentRow(n=2, title="sub-1"), Todo(n=4, title="the build", data={"agent": "sub-1", "dispatcher": "claude-1"})])
                >> Updated(AgentRow(n=2), status="subagent", dispatcher="claude-1"),
            Given(ResourceCreated(n=4, type="todo", actor="agent"), rows=[AgentRow(n=2, title="sub-1"), Todo(n=4, title="the build")]) >> Unchanged(),
            Given(ResourceCreated(n=2, type="agent", actor="system"), rows=[AgentRow(n=2, title="sub-1")]) >> Unchanged(),
        ])
        journal.events.handler(HandBackReport(), expects=[
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), Todo(n=4, title="the build", data={"reported": {"agent": "sub-1", "dispatcher": "claude-1", "how": "fixed"}})])
                >> Updated(Todo(n=4), reported={"notified": True}) & Nudged("reported"),
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), Todo(n=4, title="the build", data={"reported": {"agent": "sub-1", "dispatcher": "claude-1", "notified": True}})])
                >> Unchanged(),
            Given(TodoUpdated(n=4), rows=[AgentRow(n=1, title="claude-1"), Todo(n=4, title="the build")]) >> Unchanged(),
        ])
        journal.events.handler(LinkReportToSubagent(), expects=[
            Given(ResourceCreated(n=5, type="report", actor="agent"), rows=[AgentRow(n=1, data={"subagent_rows": [{"id": "a1", "ended": 9_000_000_000_000}]})])
                >> Updated(AgentRow(n=1), subagent_reports={"a1": 5}),
            Given(ResourceCreated(n=5, type="report", actor="user"), rows=[AgentRow(n=1, data={"subagent_rows": [{"id": "a1", "ended": 9_000_000_000_000}]})]) >> Unchanged(),
            Given(ResourceCreated(n=5, type="report", actor="agent"), rows=[AgentRow(n=1)]) >> Unchanged(),
        ])
        journal.events.handler(ClearLapsedAssignments(), expects=LAPSED)
        journal.events.handler(ClearLapsedAssignmentsOnChange(), expects=[
            Given(AgentChanged(agent=2, action="updated"), rows=[AgentRow(n=1, title="claude-1"), AgentRow(n=2, title="sub-1", data={"status": "subagent", "dispatcher": "claude-1", "active": 1.0}),
                                                             Todo(n=4, title="the build", data={"assigned": "sub-1"})])
                >> Updated(Todo(n=4), assigned="") & Nudged("lapsed"),
        ])
