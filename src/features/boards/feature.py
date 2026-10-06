from features.base import Feature
from resources.base import SYSTEM
from features.boards.controller import Boards
from features.boards.details import BoardsDetails
from features.boards.handlers import MarkQuietFillingStalled, OfferToPlaceAddedCards, boards_wanting_ideas
from features.boards.shipped import SEQUENCES
from features.boards.limits import BoardWorkStaysOnTheBoard, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.journal import Journal
from features.nudges import Nudge
from features.boards.exploration import FILLER
from features.sequences.dispatch import BOARD_OF_MESSAGE, DISPATCH_MODELS
from features.boards.orchestration import filler_model, orchestration
from features.session_briefing.start import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]



def board_of_message(record, message) -> int:
    return Boards(record, actor=SYSTEM).of_message(message)


class BoardsFeature(Feature):
    details = BoardsDetails
    nudges = (Nudge("ideas", behaviour="ideas", about=boards_wanting_ideas),)
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, orchestration, key=ORCHESTRATION)
        DISPATCH_MODELS.add(self, filler_model, key=FILLER)
        BOARD_OF_MESSAGE.add(self, board_of_message)
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard())
        journal.commands.intercept("create", PanelRepliesStayShort())
        journal.commands.intercept("create", FillerKeepsToTheBoard())
        journal.commands.intercept("update", FillerKeepsToTheBoard())
        journal.commands.intercept("complete", FillerKeepsToTheBoard())
        journal.events.handler(OfferToPlaceAddedCards())
        journal.events.handler(MarkQuietFillingStalled())
