from features.base import Feature
from features.boards.controller import Boards
from features.boards.details import BoardsDetails
from features.boards.handlers import AskForFreshIdeas, MarkQuietFillingStalled, OfferToPlaceAddedCards
from features.boards.limits import BoardWorkStaysOnTheBoard
from features.journal import Journal
from features.sequences.exploration import FILLER
from features.sequences.handlers import DISPATCH_MODELS
from features.boards.orchestration import orchestration
from features.session_briefing.start import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]


class BoardsFeature(Feature):
    details = BoardsDetails

    def register(self, journal: Journal) -> None:
        START_PARTS[ORCHESTRATION] = orchestration
        DISPATCH_MODELS[FILLER] = filler_model
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard())
        journal.events.handler(OfferToPlaceAddedCards())
        journal.events.handler(MarkQuietFillingStalled())
        journal.events.handler(AskForFreshIdeas())


def filler_model(record) -> str:
    return BoardsDetails.values(record).filler_model
