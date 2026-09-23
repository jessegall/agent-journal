from features.base import Feature
from features.journal import Journal
from features.plans.details import PlansDetails
from features.plans.handlers import (
    AdvancePlans,
    GuideBuilding,
    PassCheckpointsInAuto,
    StartApproved,
    StartBuilding,
    TakeStruckRowsOutOfUnapprovedPlans,
    TellParkedAndPickedUp,
)
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode


class PlansFeature(Feature):
    details = PlansDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(StartBuilding())
        journal.events.handler(StartApproved())
        journal.events.handler(TellParkedAndPickedUp())
        journal.events.handler(GuideBuilding())
        journal.events.handler(PassCheckpointsInAuto())
        journal.events.handler(AdvancePlans())
        journal.events.handler(TakeStruckRowsOutOfUnapprovedPlans())
        journal.agent.interceptor(RefusePlanMode())
        journal.commands.intercept("work.open", HoldWhilePlanned())
