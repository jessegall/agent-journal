from features.base import Feature
from features.boards.controller import Boards
from features.boards.details import BoardsDetails
from features.boards.limits import BoardWorkStaysOnTheBoard
from features.journal import Journal

__all__ = ["Boards"]


class BoardsFeature(Feature):
    details = BoardsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard())
