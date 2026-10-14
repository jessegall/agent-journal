from expects import Given, Kept, Refused
from events.asking import RowSaving
from framework.base import Feature
from framework.journal import Journal
from features.machines.details import MachinesDetails
from features.machines.refusing import StaleWrites


def saving(updated: float) -> RowSaving:
    return RowSaving(type="todo", n=3, updated=updated, unchanged_since=5.0)


class MachinesFeature(Feature):
    details = MachinesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.refuse(RowSaving, StaleWrites(), expects=[
            Given(saving(6.0)) >> Refused("todo 3 changed after you last saw it; look at it again before you change it"),
            Given(saving(5.0)) >> Kept(),
        ])
