from features.base import Feature
from features.journal import Journal
from features.plans.details import PlansDetails
from features.plans.handlers import AdvancePlans, GuideBuilding, PassCheckpointsInAuto
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode


class PlansFeature(Feature):
    details = PlansDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GuideBuilding())
        journal.events.handler(PassCheckpointsInAuto())
        journal.events.handler(AdvancePlans())
        journal.agent.interceptor(RefusePlanMode())
        journal.commands.intercept("work.open", HoldWhilePlanned())
