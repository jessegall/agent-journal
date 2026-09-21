from features.base import Feature
from features.journal import Journal
from features.work.commands import LogWork, ParkWork, ResumeWork
from features.work.details import WorkDetails
from features.work.handlers import (CloseWork, CountEdits, HoldUntilDeclared, OfferNextRow, OpenWork, RemindOpenWork, ResetEditsOnLog,
                                    TrackFiles)
from features.work.interceptors import RefuseBlockingQuestion, RefuseHeldWrites


class WorkFeature(Feature):
    details = WorkDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("work", LogWork())
        journal.commands.add("work", ParkWork())
        journal.commands.add("work", ResumeWork())
        journal.events.handler(HoldUntilDeclared())
        journal.events.handler(OpenWork())
        journal.events.handler(CloseWork())
        journal.events.handler(TrackFiles())
        journal.events.handler(RemindOpenWork())
        journal.events.handler(CountEdits())
        journal.events.handler(ResetEditsOnLog())
        journal.events.handler(OfferNextRow())
        journal.agent.interceptor(RefuseHeldWrites())
        journal.agent.interceptor(RefuseBlockingQuestion())
