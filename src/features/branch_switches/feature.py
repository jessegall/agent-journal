from features.base import Feature
from features.branch_switches.details import BranchSwitchesDetails
from features.branch_switches.handlers import MarkBranchSwitches
from features.journal import Journal


class BranchSwitches(Feature):
    details = BranchSwitchesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(MarkBranchSwitches())
