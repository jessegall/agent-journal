from features.base import Feature
from features.boards.controller import Boards
from features.boards.details import BoardsDetails
from features.boards.handlers import MarkQuietFillingStalled, OfferToPlaceAddedCards, boards_wanting_ideas
from features.boards.limits import BoardWorkStaysOnTheBoard, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.journal import Journal
from features.nudges import Nudge
from features.boards.exploration import FILLER
from features.sequences.dispatch import DISPATCH_MODELS
from features.boards.orchestration import filler_model, orchestration
from features.session_briefing.start import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]


class BoardsFeature(Feature):
    details = BoardsDetails
    nudges = (Nudge("ideas", behaviour="ideas", about=boards_wanting_ideas),)

    def register(self, journal: Journal) -> None:
        self.register_global(START_PARTS, orchestration, str, ORCHESTRATION)
        self.register_global(DISPATCH_MODELS, filler_model, str, FILLER)
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard())
        journal.commands.intercept("create", PanelRepliesStayShort())
        journal.commands.intercept("create", FillerKeepsToTheBoard())
        journal.commands.intercept("update", FillerKeepsToTheBoard())
        journal.commands.intercept("complete", FillerKeepsToTheBoard())
        journal.events.handler(OfferToPlaceAddedCards())
        journal.events.handler(MarkQuietFillingStalled())
