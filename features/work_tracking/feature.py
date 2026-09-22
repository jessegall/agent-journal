from features.base import Feature
from features.journal import Journal
from features.work_tracking.commands import LogWork, ParkWork, ResumeWork
from features.work_tracking.details import WorkDetails
from features.work_tracking.handlers import (CloseWork, CountEdits, EndWorkWithTodo, HoldUntilDeclared, OfferNextRow, OfferNextRowOnTheClock, OpenWork, RemindOpenWork, ResetEditsOnLog,
                                    TrackFiles)
from features.work_tracking.interceptors import RefuseHeldWrites


class WorkFeature(Feature):
    details = WorkDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("work", LogWork())
        journal.commands.add("work", ParkWork())
        journal.commands.add("work", ResumeWork())
        journal.events.handler(HoldUntilDeclared())
        journal.events.handler(OpenWork())
        journal.events.handler(CloseWork())
        journal.events.handler(EndWorkWithTodo())
        journal.events.handler(TrackFiles())
        journal.events.handler(RemindOpenWork())
        journal.events.handler(CountEdits())
        journal.events.handler(ResetEditsOnLog())
        journal.events.handler(OfferNextRow())
        journal.events.handler(OfferNextRowOnTheClock())
        journal.agent.interceptor(RefuseHeldWrites())
