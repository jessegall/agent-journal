from features.base import Feature
from features.journal import Journal
from features.work_tracking.auto import steered
from features.work_tracking.commands import AwaitWork, LogWork, ParkWork, ResumeWork
from features.work_tracking.details import WorkDetails
from features.nudges import Nudge
from features.work_tracking.handlers import (CARRY_ON_TIMES, next_row, nothing_ready, stopped_with_work, AskStillAwaiting, ClearWaitOnActivity, NameRepeatedChecks, CloseWork, CountEdits, EndWorkWithTodo, HoldUntilDeclared, AskStillBlocked, NameParkedOnTodoDone, UnblockWaitingRows, UnblockWhenPlanFinishes, OpenWork, RemindOpenWork, ResetEditsOnLog,
                                    TrackFiles)
from features.work_tracking.interceptors import RefuseHeldWrites

OFFERS = 3


class WorkFeature(Feature):
    details = WorkDetails
    nudges = (Nudge("next", behaviour="auto", about=next_row(standing=False), private=False, most=OFFERS, first=True),
              Nudge("next while waiting", behaviour="auto", about=next_row(standing=True), private=False, most=OFFERS, first=True),
              Nudge("carry on", behaviour="carry on", about=stopped_with_work, once=True),
              Nudge("nothing ready", behaviour="carry on", about=nothing_ready, most=CARRY_ON_TIMES))

    def chosen(self, record, key: str) -> bool:
        return super().chosen(record, key) or (key == "auto" and bool(steered(record)))

    def settings_view(self, record) -> dict:
        return {**super().settings_view(record), "steered": steered(record)}

    def register(self, journal: Journal) -> None:
        journal.commands.add("work", LogWork())
        journal.commands.add("work", ParkWork())
        journal.commands.add("work", ResumeWork())
        journal.commands.add("work", AwaitWork())
        journal.events.handler(AskStillAwaiting())
        journal.events.handler(ClearWaitOnActivity())
        journal.events.handler(NameRepeatedChecks())
        journal.events.handler(HoldUntilDeclared())
        journal.events.handler(OpenWork())
        journal.events.handler(CloseWork())
        journal.events.handler(EndWorkWithTodo())
        journal.events.handler(NameParkedOnTodoDone())
        journal.events.handler(UnblockWaitingRows())
        journal.events.handler(UnblockWhenPlanFinishes())
        journal.events.handler(AskStillBlocked())
        journal.events.handler(TrackFiles())
        journal.events.handler(RemindOpenWork())
        journal.events.handler(CountEdits())
        journal.events.handler(ResetEditsOnLog())
        journal.agent.interceptor(RefuseHeldWrites())
