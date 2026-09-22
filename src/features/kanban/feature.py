from features.base import Feature
from features.journal import Journal
from features.kanban.commands import ShiftCard, ShowBoard
from features.kanban.details import KanbanDetails


class KanbanFeature(Feature):
    details = KanbanDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("todo", ShowBoard())
        journal.commands.add("todo", ShiftCard())
