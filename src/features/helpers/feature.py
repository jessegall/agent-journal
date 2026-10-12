from controllers.types import Agents, Todos
from events.agents import ClockTicked
from events.agents import AgentChanged
from events.messages import MessageCreated
from providers.payload import BashCall, WriteCall
from expects import Answered, Given, Kept, Nudged, Refused, Unchanged, Updated
from events.questions import QuestionCreated
from framework.base import Feature
from providers.payload import Dispatch
from resources.base import AGENT, USER
from resources.types import AgentRow, Message, Question, Todo
from resources.helpers import Helper
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.handlers import (HelperBriefed, HelperContinued, MarkTheHelperBriefed, MarkTheHelperContinued, NameStoppedOrQuietHelpers, RelayAnswerToDispatcher,
                                       TellAFailedTurnOnChange, TellAQuestionAskedAway)
from features.helpers.commands import RetireSubagent
from features.helpers.interceptors import (HandedRowsCloseOnlyThroughTheirHelper, HandedRowsStayAssigned, KeepSubagentFiles,
                                          OfferKeptAgentsFirst, RefuseTestRunsToHelpers)
from framework.journal import Journal

__all__ = ["Helpers"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
ASKED = QuestionCreated(n=1, type="question", action="asked", actor=AGENT)

HANDED = Todo(n=5, title="Fix the crash", data={"assigned": "helper:3"})
AT_WORK = Helper(n=3, title="Rhea", data={"name": "Rhea"})
BY_AGENT = {"actor": AGENT}
SUBAGENT_ROW = AgentRow(n=1, title="claude-1", data={"parent": "claude-0", "provider": "claude"})
NEVER_RUN_TESTS = ("Helpers and subagents write tests but never run them: write the test that proves your change, commit, and name it in your report so the agent that dispatched you runs it. "
                   "That agent can allow your runs with journal helper allow_suite.")
KEPT_BY_ITS_HELPER = ("todo 5 is handed to helper 3: only it marks it done, and taking its work closes it; "
                      "to close, strike or reassign it yourself, journal helper stop 3 gives it back first; "
                      'journal helper say <helper> "<text>" --todos 5 moves it to another helper')


class HelpersFeature(Feature):
    details = HelpersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TellAFailedTurnOnChange(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"event": "failed", "failure": "overloaded"})]) >> Unchanged(),
        ])
        journal.events.handler(MarkTheHelperContinued(), expects=[
            Given(HelperContinued(n=4, type="helper", action="continued"), rows=[AGENT_ROW, Helper(n=4, title="Zed", data={"name": "Zed", "latest": "reading the log"})])
                >> Updated(AgentRow(n=1), cards=[{"label": "Continued helper 4", "name": "Zed", "detail": "reading the log"}]),
        ])
        journal.events.handler(MarkTheHelperBriefed(), expects=[
            Given(HelperBriefed(n=4, type="helper", action="briefed"), rows=[AGENT_ROW, Helper(n=4, title="Zed", data={"name": "Zed", "latest": "reading the log"})])
                >> Updated(AgentRow(n=1), cards=[{"label": "Briefed helper 4", "name": "Zed", "detail": "reading the log"}]),
        ])
        journal.events.handler(NameStoppedOrQuietHelpers(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(TellAQuestionAskedAway(), expects=[
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1"}), AGENT_ROW]) >> Nudged("subagent asking"),
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1", "hidden": True}), AGENT_ROW]) >> Unchanged(),
            Given(ASKED, rows=[Question(n=1, title="Which branch?"), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(RelayAnswerToDispatcher(), expects=[
            Given(MessageCreated(n=2, type="message", actor="agent"), rows=[AGENT_ROW, Message(n=2, title="done", brief="done", seen=["agent"])]) >> Unchanged(),
        ])
        journal.commands.intercept("todo.complete", HandedRowsCloseOnlyThroughTheirHelper(), expects=[
            Given((Todos, BY_AGENT, {"n": 5}), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given((Todos, {"actor": USER}, {"n": 5}), rows=[HANDED, AT_WORK]) >> Kept(),
            Given((Todos, BY_AGENT, {"n": 5}), rows=[Todo(n=5, title="Fix the crash"), AT_WORK]) >> Kept(),
            Given((Todos, BY_AGENT, {"n": 5}), rows=[HANDED, Helper(n=3, title="Rhea", completed=1.0, data={"name": "Rhea"})]) >> Kept(),
            Given((Todos, BY_AGENT, {"n": 5}), rows=[HANDED]) >> Kept(),
        ])
        journal.commands.intercept("todo.update", HandedRowsStayAssigned(), expects=[
            Given((Todos, BY_AGENT, {"n": 5, "assigned": "helper:4"}), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given((Todos, BY_AGENT, {"n": 5, "pending": "waiting for its report"}), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given((Todos, BY_AGENT, {"n": 5, "title": "Fix the crash properly"}), rows=[HANDED, AT_WORK]) >> Kept(),
            Given((Todos, {"actor": USER}, {"n": 5, "assigned": "helper:4"}), rows=[HANDED, AT_WORK]) >> Kept(),
        ])
        journal.commands.add("agent", RetireSubagent(), expects=[
            Given((Agents, "sub-9"), rows=[AGENT_ROW]) >> Refused("sub-9 is not one of your subagents; name one by its id: journal agent retire <id>"),
            Given((Agents, "sub-1"), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "subagent_rows": [{"id": "sub-1", "task": "Zed: the build"}]})])
                >> Answered("subagent sub-1 is retired, so it no longer counts against the agents kept for reuse"),
        ])
        journal.agent.interceptor(KeepSubagentFiles(), expects=[
            Given(WriteCall.from_payload("Write", {"file_path": "src/app.py", "content": "x"}, {}), rows=[SUBAGENT_ROW]) >> Kept() & Updated(AgentRow(n=1), touched_files=["src/app.py"]),
            Given(WriteCall.from_payload("Write", {"file_path": "src/app.py", "content": "x"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"parent": "claude-0", "touched_files": ["src/app.py"]})])
                >> Kept() & Unchanged(),
        ])
        journal.agent.interceptor(RefuseTestRunsToHelpers(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "python -m pytest -q"}, {}), rows=[SUBAGENT_ROW]) >> Refused(NEVER_RUN_TESTS),
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[SUBAGENT_ROW]) >> Kept(),
            Given(BashCall.from_payload("Bash", {"command": "python -m pytest -q"}, {}), rows=[AGENT_ROW]) >> Kept(),
        ])
        journal.agent.canceler(OfferKeptAgentsFirst(), expects=[
            Given(Dispatch("general-purpose", "sonnet", True)) >> Kept(),
        ])
