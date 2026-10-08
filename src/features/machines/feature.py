from features.base import Feature
from features.journal import Journal
from features.machines.details import MachinesDetails


class MachinesFeature(Feature):
    details = MachinesDetails

    def register(self, journal: Journal) -> None:
        pass
