from features.base import Feature
from features.journal import Journal
from features.update_reports.commands import Changes, Drop, Item, Note, Recap
from features.update_reports.details import UpdateReportsDetails


class UpdateReports(Feature):
    details = UpdateReportsDetails

    def register(self, journal: Journal) -> None:
        for command in (Changes(), Recap(), Note(), Item(), Drop()):
            journal.commands.add("report", command)
