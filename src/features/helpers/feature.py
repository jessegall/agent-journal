from controllers.types import Agents, Todos
from events.agents import AgentChanged, ClockTicked, ToolCallAnswered
from events.answers import Allowed, Refused as Refusal
from events.asking import AgentDispatching, RowWriting, ToolCallAsked
from events.helpers import (AnswerToRelay, HelperAsks, HelperBriefed, HelperContinued, HelperIdle, HelperQuiet, HelperRefused, HelperStopped, HelperTurnFailed,
                            SubagentAsks, SubagentTouched)
from events.messages import MessageCreated
from events.questions import QuestionCreated
from expects import Answered, Dispatches, Given, Kept, Nudged, Refused, Unchanged, Updated, Wrote, nothing
from framework.base import Feature
from resources.base import AGENT, USER
from resources.types import AgentRow, Environment, Message, Question, Todo
from resources.helpers import Helper
from controllers.types import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.answering import NEVER_RUN_TESTS, OfferKeptAgentsFirst, RefuseTestRunsToHelpers
from features.helpers.commands import RetireSubagent
from features.helpers.handlers import (KeepSubagentFiles, MarkTheHelperBriefed, MarkTheHelperContinued, NameIdleHelper, NameQuietHelper, NameRefusedHelper,
                                       NameStoppedHelper, RelayAnswerToDispatcher, TellAFailedTurn, TellAQuestionAskedAway, TellASubagentAsking)
from features.helpers.listeners import SpotAnswerToDispatcher, SpotFailedTurn, SpotQuestionAskedAway, SpotSubagentFiles, SpotWatchedHelpers
from features.helpers.refusing import HandedRowsCloseOnlyThroughTheirHelper, HandedRowsStayAssigned
from framework.journal import Journal

__all__ = ["Helpers"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
ASKED = QuestionCreated(n=1, type="question", action="asked", actor=AGENT)
SUITE = "python -m " + "pytest -q"


def completing(actor: str) -> RowWriting:
    return RowWriting(type="todo", action="complete", actor=actor, fields=(("n", 5),))


def updating(actor: str, **fields) -> RowWriting:
    return RowWriting(type="todo", action="update", actor=actor, fields=(("n", 5), *fields.items()))

HANDED = Todo(n=5, title="Fix the crash", data={"assigned": "helper:3"})
AT_WORK = Helper(n=3, title="Rhea", data={"name": "Rhea"})
HELPING_HERE = Environment(n=1, title="t", data={"kind": "helper", "owner": "helper:3", "launched_from": "t"})
ANSWERING = Helper(n=3, title="Rhea", data={"name": "Rhea", "answering": True})
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
        journal.events.listen(AgentChanged, SpotFailedTurn(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"event": "failed", "failure": "overloaded"})]) >> Dispatches(nothing),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"event": "failed", "failure": "overloaded"}), HELPING_HERE, AT_WORK])
                >> Dispatches(HelperTurnFailed(failure="overloaded")),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title="claude-1", data={"event": "working"}), HELPING_HERE, AT_WORK]) >> Dispatches(nothing),
        ])
        journal.events.handle(HelperTurnFailed, TellAFailedTurn(), expects=[
            Given(HelperTurnFailed(failure="overloaded"), rows=[AGENT_ROW]) >> Unchanged(),
            Given(HelperTurnFailed(failure="overloaded"), rows=[AGENT_ROW, HELPING_HERE, AT_WORK])
                >> Updated(Helper(n=3), report="My turn ended in an error, so I stopped: overloaded", answering=False),
        ])
        journal.events.handle(HelperContinued, MarkTheHelperContinued(), expects=[
            Given(HelperContinued(n=4, type="helper", action="continued"), rows=[AGENT_ROW, Helper(n=4, title="Zed", data={"name": "Zed", "latest": "reading the log"})])
                >> Updated(AgentRow(n=1), cards=[{"label": "Continued helper 4", "name": "Zed", "detail": "reading the log"}]),
        ])
        journal.events.handle(HelperBriefed, MarkTheHelperBriefed(), expects=[
            Given(HelperBriefed(n=4, type="helper", action="briefed"), rows=[AGENT_ROW, Helper(n=4, title="Zed", data={"name": "Zed", "latest": "reading the log"})])
                >> Updated(AgentRow(n=1), cards=[{"label": "Briefed helper 4", "name": "Zed", "detail": "reading the log"}]),
        ])
        journal.events.listen(ClockTicked, SpotWatchedHelpers(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=2), rows=[AGENT_ROW, Helper(n=1, title="Rhea", data={"name": "Rhea"})]) >> Dispatches(nothing),
        ])
        journal.events.handle(HelperRefused, NameRefusedHelper(), expects=[
            Given(HelperRefused(n=3, name="Rhea", provider="codex", reason="no such model", ref="helper:3"), rows=[AGENT_ROW])
                >> Nudged("refused", n=3, name="Rhea", provider="codex", reason="no such model"),
        ])
        journal.events.handle(HelperStopped, NameStoppedHelper(), expects=[
            Given(HelperStopped(n=3, name="Rhea", why_it_stopped="exited", ref="helper:3"), rows=[AGENT_ROW]) >> Nudged("stopped", n=3, name="Rhea", cause="exited"),
        ])
        journal.events.handle(HelperQuiet, NameQuietHelper(), expects=[
            Given(HelperQuiet(n=3, name="Rhea", minutes=25), rows=[AGENT_ROW]) >> Nudged("quiet", n=3, name="Rhea", minutes=25),
        ])
        journal.events.handle(HelperIdle, NameIdleHelper(), expects=[
            Given(HelperIdle(n=3, name="Rhea", minutes=3), rows=[AGENT_ROW]) >> Nudged("idle", n=3, name="Rhea", minutes=3),
        ])
        journal.events.listen(QuestionCreated, SpotQuestionAskedAway(), expects=[
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1"}), AGENT_ROW])
                >> Dispatches(SubagentAsks(who="subagent sub-1", question=1, text="Which branch?", options="It offers no options, so answer it in your own words.",
                                           command='journal question answer 1 "<answer>" --set reason="<why>"', ref="question:1")),
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1", "hidden": True}), AGENT_ROW]) >> Dispatches(nothing),
            Given(ASKED, rows=[Question(n=1, title="Which branch?"), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(SubagentAsks, TellASubagentAsking(), expects=[
            Given(SubagentAsks(who="subagent sub-1", question=1, text="Which branch?", options="It offers no options, so answer it in your own words.",
                               command='journal question answer 1 "<answer>" --set reason="<why>"', ref="question:1"), rows=[AGENT_ROW]) >> Nudged("subagent asking"),
        ])
        journal.events.handle(HelperAsks, TellAQuestionAskedAway(), expects=[
            Given(HelperAsks(environment="t", who="helper 3, Rhea", question=1, text="Which branch?", options="It offers no options, so answer it in your own words.",
                             command='journal --env "main-rhea" question answer 1 "<answer>" --set reason="<why>"', ref="helper:3"), rows=[AGENT_ROW])
                >> Nudged("helper asking"),
        ])
        journal.events.listen(MessageCreated, SpotAnswerToDispatcher(), expects=[
            Given(MessageCreated(n=2, type="message", actor="agent"), rows=[AGENT_ROW, Message(n=2, title="done", brief="done", seen=["agent"])]) >> Dispatches(nothing),
            Given(MessageCreated(n=2, type="message", actor="agent"), rows=[AGENT_ROW, HELPING_HERE, ANSWERING, Message(n=2, title="done", brief="done", seen=["agent"])])
                >> Dispatches(AnswerToRelay(message=2)),
            Given(MessageCreated(n=2, type="message", actor="agent"), rows=[AGENT_ROW, HELPING_HERE, AT_WORK, Message(n=2, title="done", brief="done", seen=["agent"])]) >> Dispatches(nothing),
            Given(MessageCreated(n=2, type="message", actor="user"), rows=[AGENT_ROW, HELPING_HERE, ANSWERING, Message(n=2, title="done", brief="done")]) >> Dispatches(nothing),
            Given(MessageCreated(n=2, type="message", actor="agent"), rows=[AGENT_ROW, HELPING_HERE, ANSWERING, Message(n=2, title="done", brief="done", seen=["agent"], data={"peer": "Zed"})])
                >> Dispatches(nothing),
        ])
        journal.events.handle(AnswerToRelay, RelayAnswerToDispatcher(), expects=[
            Given(AnswerToRelay(message=2), rows=[AGENT_ROW, Message(n=2, title="done", brief="done", seen=["agent"])]) >> Unchanged(),
            Given(AnswerToRelay(message=2), rows=[AGENT_ROW, HELPING_HERE, ANSWERING, Message(n=2, title="done", brief="done", seen=["agent"])])
                >> Wrote(Message(title="done", brief="done", data={"peer": "Rhea"})),
        ])
        journal.commands.refuse(RowWriting, HandedRowsCloseOnlyThroughTheirHelper(), expects=[
            Given(completing(AGENT), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given(completing(USER), rows=[HANDED, AT_WORK]) >> Kept(),
            Given(completing(AGENT), rows=[Todo(n=5, title="Fix the crash"), AT_WORK]) >> Kept(),
            Given(completing(AGENT), rows=[HANDED, Helper(n=3, title="Rhea", completed=1.0, data={"name": "Rhea"})]) >> Kept(),
            Given(completing(AGENT), rows=[HANDED]) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, HandedRowsStayAssigned(), expects=[
            Given(updating(AGENT, assigned="helper:4"), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given(updating(AGENT, pending="waiting for its report"), rows=[HANDED, AT_WORK]) >> Refused(KEPT_BY_ITS_HELPER),
            Given(updating(AGENT, title="Fix the crash properly"), rows=[HANDED, AT_WORK]) >> Kept(),
            Given(updating(USER, assigned="helper:4"), rows=[HANDED, AT_WORK]) >> Kept(),
        ])
        journal.commands.add("agent", RetireSubagent(), expects=[
            Given((Agents, "sub-9"), rows=[AGENT_ROW]) >> Refused("sub-9 is not one of your subagents; name one by its id: journal agent retire <id>"),
            Given((Agents, "sub-1"), rows=[AgentRow(n=1, title="claude-1", data={"status": "working", "event": "PostToolUse", "subagent_rows": [{"id": "sub-1", "task": "Zed: the build"}]})])
                >> Answered("subagent sub-1 is retired, so it no longer counts against the agents kept for reuse"),
        ])
        journal.events.listen(ToolCallAnswered, SpotSubagentFiles(), expects=[
            Given(ToolCallAnswered(agent=1, tool="Write", subagent=True, paths=("src/app.py",)), rows=[SUBAGENT_ROW])
                >> Dispatches(SubagentTouched(agent=1, files=("src/app.py",))),
            Given(ToolCallAnswered(agent=1, tool="Write", subagent=True, paths=("src/app.py",)),
                  rows=[AgentRow(n=1, title="claude-1", data={"parent": "claude-0", "touched_files": ["src/app.py"]})]) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="Write", paths=("src/app.py",)), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(SubagentTouched, KeepSubagentFiles(), expects=[
            Given(SubagentTouched(agent=1, files=("src/app.py",)), rows=[SUBAGENT_ROW]) >> Updated(AgentRow(n=1), touched_files=["src/app.py"]),
        ])
        journal.events.answer(ToolCallAsked, RefuseTestRunsToHelpers(), expects=[
            Given(ToolCallAsked(tool="Bash", input=SUITE, command=SUITE, subagent=True, session="claude-1"), rows=[SUBAGENT_ROW]) >> Answered(Refusal(NEVER_RUN_TESTS)),
            Given(ToolCallAsked(tool="Bash", input="ls", command="ls", subagent=True, session="claude-1"), rows=[SUBAGENT_ROW]) >> Answered(Allowed()),
            Given(ToolCallAsked(tool="Bash", input=SUITE, command=SUITE, session="claude-1"), rows=[AGENT_ROW]) >> Answered(Allowed()),
        ])
        journal.events.answer(AgentDispatching, OfferKeptAgentsFirst(), expects=[
            Given(AgentDispatching(kind="general-purpose", model="sonnet", model_supported=True, session="claude-1"), rows=[AGENT_ROW]) >> Answered(Allowed()),
            Given(AgentDispatching(kind="general-purpose", subagent=True, session="claude-1"), rows=[AGENT_ROW]) >> Answered(Allowed()),
        ])
