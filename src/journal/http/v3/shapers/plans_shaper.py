from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans

STATUS = {PlanState.DRAFT: "building", PlanState.READY: "ready", PlanState.APPROVED: "approved", PlanState.STARTED: "active", PlanState.PARKED: "parked", PlanState.DONE: "done", PlanState.CANCELLED: "abandoned"}


class PlansShaper(Shaper):
    type = "plan"

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def rows(self) -> list[V3Row]:
        return [self.row(p) for p in self.plans.in_()]

    def row(self, p) -> V3Row:
        tasks, phases = self.plans.tasks_of(p), self.plans.phases_of(p)
        drawn = [{"title": phase.title, "todos": [t.id for t in self.plans.tasks_in(phase)], "when": phase.complete_when, "checkpoint": phase.checkpoint} for phase in phases]
        phased = {t for phase in drawn for t in phase["todos"]}
        loose = [t.id for t in tasks if t.id not in phased]
        if loose:
            drawn.append({"title": "Under no phase yet", "todos": loose, "when": "", "checkpoint": False})
        return V3Row.of("plan", p, title=p.title, brief=p.brief, refs=[f"todo:{t.id}" for t in tasks], completed=seconds(p.updated_at) if p.state == PlanState.DONE else 0.0,
                        data={"status": STATUS[p.state], "stage": self.stage(p, phases, tasks), "phases": drawn, "dismissed": False})

    @staticmethod
    def stage(p, phases, tasks) -> str:
        """Where the building stands: the goal, then the phases, then the tasks, then ready."""
        if p.state != PlanState.DRAFT:
            return "ready"
        if not p.brief:
            return "goal"
        return "phases" if not phases else "todos"
