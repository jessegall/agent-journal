from features.base import Feature
from features.boards.controller import Boards
from features.boards.details import BoardsDetails

__all__ = ["Boards"]


class BoardsFeature(Feature):
    details = BoardsDetails
