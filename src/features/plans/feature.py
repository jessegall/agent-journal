from features.base import Feature
from features.plans.summary import plans_shown
from overview.parts import SUMMARY_PARTS
from features.journal import Journal
from features.plans.details import PlansDetails
from features.plans.handlers import (
    AdvancePlans,
    DelegatePlansOfHandedRows,
    EndReviewWithItsReport,
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
from features.sending import Nudge
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode
from features.plans.progress import held
from features.work_tracking.next import ROW_HOLDS

STILL_TIMES = 3


class PlansFeature(Feature):
    details = PlansDetails
    nudges = (Nudge("still", behaviour="still", about=still_plans, most=STILL_TIMES,
                    guarantee="When a running plan has not moved for a while, the agent is told, a few times."),
              Nudge("blocked", behaviour="blocked", about=blocked_plans,
                    guarantee="When a running plan has blocked to-dos, the agent is told to check whether each one is still blocked."))

    def register(self, journal: Journal) -> None:
        SUMMARY_PARTS.add(None, plans_shown, key="plans")
        ROW_HOLDS.add(self, held)
        journal.events.handler(StartBuilding())
        journal.events.handler(DelegatePlansOfHandedRows())
        journal.events.handler(StartApproved())
        journal.events.handler(EndReviewWithItsReport())
        journal.events.handler(TellParkedAndPickedUp())
        journal.events.handler(GuideBuilding())
        journal.events.handler(PassCheckpointsInAuto())
        journal.events.handler(AdvancePlans())
        journal.events.handler(ReopenPlansWithTheirRows())
        journal.events.handler(TakeStruckRowsOutOfUnapprovedPlans())
        journal.agent.interceptor(RefusePlanMode())
        journal.commands.intercept("work.open", HoldWhilePlanned())
