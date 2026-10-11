from controllers.types import Todos
from expects import Given, Kept, Nudged, Refused, Unchanged
from features.ask_questions.handlers import QuestionAsked
from features.base import Feature
from providers.payload import Dispatch
from resources.base import AGENT, USER
from resources.types import AgentRow, Question, Todo
from features.helpers.resource import Helper
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.handlers import (MarkTheHelperBriefed, MarkTheHelperContinued, NameStoppedOrQuietHelpers, RelayAnswerToDispatcher,
                                       TellAFailedTurnOnChange, TellAQuestionAskedAway)
from features.helpers.commands import RetireSubagent
from features.helpers.interceptors import (HandedRowsCloseOnlyThroughTheirHelper, HandedRowsStayAssigned, KeepSubagentFiles,
                                          OfferKeptAgentsFirst, RefuseTestRunsToHelpers)
from features.journal import Journal

__all__ = ["Helpers"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
ASKED = QuestionAsked(n=1, type="question", action="asked", actor=AGENT)

HANDED = Todo(n=5, title="Fix the crash", data={"assigned": "helper:3"})
AT_WORK = Helper(n=3, title="Rhea", data={"name": "Rhea"})
BY_AGENT = {"actor": AGENT}
KEPT_BY_ITS_HELPER = ("todo 5 is handed to helper 3: only it marks it done, and taking its work closes it; "
                      "to close, strike or reassign it yourself, journal helper stop 3 gives it back first; "
                      'journal helper say <helper> "<text>" --todos 5 moves it to another helper')


class HelpersFeature(Feature):
    details = HelpersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TellAFailedTurnOnChange())
        journal.events.handler(MarkTheHelperContinued())
        journal.events.handler(MarkTheHelperBriefed())
        journal.events.handler(NameStoppedOrQuietHelpers())
        journal.events.handler(TellAQuestionAskedAway(), expects=[
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1"}), AGENT_ROW]) >> Nudged("subagent asking"),
            Given(ASKED, rows=[Question(n=1, title="Which branch?", data={"agent": "sub-1", "hidden": True}), AGENT_ROW]) >> Unchanged(),
            Given(ASKED, rows=[Question(n=1, title="Which branch?"), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(RelayAnswerToDispatcher())
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
        journal.commands.add("agent", RetireSubagent())
        journal.agent.interceptor(KeepSubagentFiles())
        journal.agent.interceptor(RefuseTestRunsToHelpers())
        journal.agent.canceler(OfferKeptAgentsFirst(), expects=[
            Given(Dispatch("general-purpose", "sonnet", True)) >> Kept(),
        ])
