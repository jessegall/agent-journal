from features.figure_floors.details import FigureFloorsDetails
from framework.base import Feature
from framework.journal import Journal


class FigureFloors(Feature):
    details = FigureFloorsDetails

    def register(self, journal: Journal) -> None:
        return None
