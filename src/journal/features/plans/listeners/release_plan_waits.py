from journal.events.listener import Listener
from journal.events.rows.plan_reopened import PlanReopened
from journal.features.tasks.support.waits import Waits
from journal.repositories.plans import Plans
from journal.support.actor import Actor


class ReleasePlanWaits(Listener[PlanReopened]):
    """A plan open again, whatever opened it, waits on nothing: its wait links go and the checks its block made are retired."""

    def __init__(self, plans: Plans, waits: Waits) -> None:
        self.plans, self.waits = plans, waits

    def handle(self, event: PlanReopened) -> None:
        self.waits.released(self.plans.find(event.plan_id), event.time, Actor.system())
