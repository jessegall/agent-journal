from features.base import Feature
from features.journal import Journal
from features.plans.details import PlansDetails
from features.plans.handlers import (
    AdvancePlans,
    GuideBuilding,
    PassCheckpointsInAuto,
    ReopenPlansWithTheirRows,
    StartApproved,
    StartBuilding,
    TakeStruckRowsOutOfUnapprovedPlans,
    TellParkedAndPickedUp,
    blocked_plans,
    still_plans,
)
from features.nudges import Nudge
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode
from features.plans.progress import held
from features.work_tracking.next import ROW_HOLDS

STILL_TIMES = 3


class PlansFeature(Feature):
    details = PlansDetails
    nudges = (Nudge("still", behaviour="still", about=still_plans, most=STILL_TIMES), Nudge("blocked", behaviour="blocked", about=blocked_plans))

    def register(self, journal: Journal) -> None:
        ROW_HOLDS.add(self, held)
        journal.events.handler(StartBuilding())
        journal.events.handler(StartApproved())
        journal.events.handler(TellParkedAndPickedUp())
        journal.events.handler(GuideBuilding())
        journal.events.handler(PassCheckpointsInAuto())
        journal.events.handler(AdvancePlans())
        journal.events.handler(ReopenPlansWithTheirRows())
        journal.events.handler(TakeStruckRowsOutOfUnapprovedPlans())
        journal.agent.interceptor(RefusePlanMode())
        journal.commands.intercept("work.open", HoldWhilePlanned())
