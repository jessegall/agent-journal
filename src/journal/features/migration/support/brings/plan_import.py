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
from journal.repositories.plans import PHASE_LINK, PLAN_LINK, PHASE_TASK_LINK, Plans

STATES = {"building": PlanState.DRAFT, "draft": PlanState.DRAFT, "ready": PlanState.READY, "reviewing": PlanState.READY, "approved": PlanState.APPROVED,
          "active": PlanState.STARTED, "waiting": PlanState.STARTED, "parked": PlanState.SUSPENDED, "done": PlanState.FINISHED, "abandoned": PlanState.CANCELLED}


class PlanImport(EnvironmentKind):
    """A plan keeps its state, its phases in order and its tasks under them, once the tasks have come across."""

    kind = "plan"
    title = "plans"

    def __init__(self, environments: Environments, ledger: MigratedRows, plans: Plans, phases: Phases, links: Links) -> None:
        super().__init__(environments, ledger)
        self.plans, self.phases, self.links = plans, phases, links

    def created(self, row: Version3Row, into: Environment, attached: Path, actor: Actor) -> Plan:
        plan = self.plans.imported(Plan(environment_id=into.id, title=row.title, brief=row.brief, state=STATES.get(row.data.get("status", ""), PlanState.DRAFT)), row.creation_time(), actor)
        for given in row.listed("phases"):
            phase = self.phases.imported(Phase(environment_id=into.id, title=given.get("title", ""), complete_when=given.get("when", ""), checkpoint=bool(given.get("checkpoint"))), row.creation_time(), actor)
            self.links.save(Link(source=Ref.build(phase), target=Ref.build(plan), kind=PHASE_TASK_LINK), actor)
            for task in [rows for n in given.get("todos", []) if (rows := self.ledger.referred(into.name, f"todo:{n}"))]:
                self.links.save(Link(source=task, target=Ref.build(plan), kind=PLAN_LINK), actor)
                self.links.save(Link(source=task, target=Ref.build(phase), kind=PHASE_LINK), actor)
        return plan
