from expects import Given, Nudged, Unchanged
from features.ask_questions.handlers import QuestionAsked
from features.base import Feature
from resources.base import AGENT
from resources.types import AgentRow, Question
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
        journal.commands.intercept("todo.complete", HandedRowsCloseOnlyThroughTheirHelper())
        journal.commands.intercept("todo.update", HandedRowsStayAssigned())
        journal.commands.add("agent", RetireSubagent())
        journal.agent.interceptor(KeepSubagentFiles())
        journal.agent.interceptor(RefuseTestRunsToHelpers())
        journal.agent.canceler(OfferKeptAgentsFirst())
