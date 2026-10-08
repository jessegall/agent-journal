from features.base import Feature
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails
from features.helpers.handlers import NameStoppedOrQuietHelpers, RelayAnswerToDispatcher, TellAFailedTurnOnChange, TellAQuestionAskedAway
from features.helpers.commands import RetireSubagent
from features.helpers.interceptors import (HandedRowsCloseOnlyThroughTheirHelper, HandedRowsStayAssigned, KeepSubagentFiles,
                                          OfferKeptAgentsFirst, RefuseTestRunsToHelpers)
from features.journal import Journal

__all__ = ["Helpers"]


class HelpersFeature(Feature):
    details = HelpersDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TellAFailedTurnOnChange())
        journal.events.handler(NameStoppedOrQuietHelpers())
        journal.events.handler(TellAQuestionAskedAway())
        journal.events.handler(RelayAnswerToDispatcher())
        journal.commands.intercept("todo.complete", HandedRowsCloseOnlyThroughTheirHelper())
        journal.commands.intercept("todo.update", HandedRowsStayAssigned())
        journal.commands.add("agent", RetireSubagent())
        journal.agent.interceptor(KeepSubagentFiles())
        journal.agent.interceptor(RefuseTestRunsToHelpers())
        journal.agent.canceler(OfferKeptAgentsFirst())
