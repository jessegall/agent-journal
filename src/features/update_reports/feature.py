from features.base import Feature
from features.journal import Journal
from features.update_reports.commands import Changes, Dismiss, Drop, Item, Note, Recap
from features.update_reports.details import UpdateReportsDetails
from features.update_reports.handlers import OfferAnUpdate


class UpdateReports(Feature):
    details = UpdateReportsDetails

    def register(self, journal: Journal) -> None:
        for command in (Changes(), Recap(), Note(), Item(), Drop(), Dismiss()):
            journal.commands.add("report", command)
        journal.events.handler(OfferAnUpdate())
