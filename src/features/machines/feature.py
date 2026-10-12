from controllers.base import SAVE_CHECKS
from framework.base import Feature
from framework.journal import Journal
from features.machines.details import MachinesDetails
from features.machines.stale import StaleWrites


class MachinesFeature(Feature):
    details = MachinesDetails

    def register(self, journal: Journal) -> None:
        SAVE_CHECKS.add(self, StaleWrites())
