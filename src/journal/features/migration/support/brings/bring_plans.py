from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.link import Link
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.support.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.phases import Phases
from journal.repositories.plans import IN_PHASE, IN_PLAN, PHASE_OF, Plans

STATES = {"building": PlanState.DRAFT, "draft": PlanState.DRAFT, "ready": PlanState.READY, "reviewing": PlanState.READY, "approved": PlanState.APPROVED,
          "active": PlanState.STARTED, "waiting": PlanState.STARTED, "parked": PlanState.PARKED, "done": PlanState.DONE, "abandoned": PlanState.CANCELLED}
"""Each version 3 plan status as the state it has here: an approval stays an approval."""


class BringPlans(EnvironmentKind):
    """A plan keeps its state, its phases in order and its tasks under them, once the tasks have come across."""

    kind = "plan"
    title = "plans"

    def __init__(self, environments: Environments, ledger: MigratedRows, plans: Plans, phases: Phases, links: Links) -> None:
        super().__init__(environments, ledger)
        self.plans, self.phases, self.links = plans, phases, links

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Plan:
        plan = self.plans.imported(Plan(environment_id=into.id, title=row.title, brief=row.brief, state=STATES.get(row.data.get("status", ""), PlanState.DRAFT)), row.made_at(), by)
        for given in row.listed("phases"):
            phase = self.phases.imported(Phase(environment_id=into.id, title=given.get("title", ""), complete_when=given.get("when", ""), checkpoint=bool(given.get("checkpoint"))), row.made_at(), by)
            self.links.save(Link(source=Ref.to(phase), target=Ref.to(plan), kind=PHASE_OF), by)
            for task in [found for n in given.get("todos", []) if (found := self.ledger.referred(into.name, f"todo:{n}"))]:
                self.links.save(Link(source=task, target=Ref.to(plan), kind=IN_PLAN), by)
                self.links.save(Link(source=task, target=Ref.to(phase), kind=IN_PHASE), by)
        return plan
