from features.base import Feature
from features.work_tracking.auto import automatic
from overview.parts import SUMMARY_PARTS
from features.journal import Journal
from features.work_tracking.auto import chosen_or_steered, steered
from features.work_tracking.commands import AwaitWork, LogWork, ParkWork, ResumeWork
from features.work_tracking.details import WorkDetails
from features.sending import Nudge
from features.work_tracking.handlers import (CARRY_ON_TIMES, next_row, nothing_ready, stopped_in_auto, stopped_with_work, next_while_helping, AskStillAwaiting, ClearWaitOnActivity, NameRepeatedChecks, CloseWork, CountEdits, EndWorkWithTodo, HoldUntilDeclared, AskStillBlocked, NameParkedOnTodoDone, UnblockWaitingRows, UnblockWhenPlanFinishes, OpenWork, RemindOpenWork, ResetEditsOnLog,
                                    TrackFiles)
from features.work_tracking.interceptors import RefuseHeldCalls, RefuseWaitingInTheShell


class WorkFeature(Feature):
    details = WorkDetails
    nudges = (Nudge("next", behaviour="auto", about=next_row(standing=False), private=False, most=1,
                    guarantee="With auto mode on and no work in hand, the agent is offered the next to-do that is ready."),
              Nudge("next while waiting", behaviour="auto", about=next_row(standing=True), private=False, most=1,
                    guarantee="When the work in hand is waiting on something, the agent is offered the next ready to-do rather than sitting out the wait."),
              Nudge("next while a helper works", behaviour="auto", about=next_while_helping, private=False, most=1,
                    guarantee="When the work in hand waits on a helper, the agent is offered the next ready to-do instead of waiting for it."),
              Nudge("carry on", behaviour="carry on", about=stopped_with_work, once=True,
                    guarantee="When the agent stops with work still in hand, it is asked once to carry on with it."),
              Nudge("auto carry on", behaviour="carry on", about=stopped_in_auto, most=CARRY_ON_TIMES,
                    guarantee="With auto mode on, an agent that stops while the user has been quiet is told to carry on, a few times."),
              Nudge("nothing ready", behaviour="nothing ready", about=nothing_ready, most=CARRY_ON_TIMES,
                    guarantee="When every open row is waiting on something, the agent is told there is nothing ready to take."))

    def chosen(self, record, key: str) -> bool:
        return chosen_or_steered(super().chosen(record, key), record, key)

    def settings_view(self, record) -> dict:
        return {**super().settings_view(record), "steered": steered(record)}

    def register(self, journal: Journal) -> None:
        SUMMARY_PARTS.add(None, automatic, key="auto")
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
        journal.agent.interceptor(RefuseHeldCalls())
        journal.agent.interceptor(RefuseWaitingInTheShell())
