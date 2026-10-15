from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.environment import Environment
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans

STATUS = {PlanState.DRAFT: "building", PlanState.STARTED: "active", PlanState.PARKED: "parked", PlanState.DONE: "done"}


class PlansShaper(Shaper):
    type = "plan"

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def rows(self, environment: Environment) -> list[V3Row]:
        rows = []
        for p in self.plans.in_(environment.id):
            tasks = self.plans.tasks_of(p)
            rows.append(V3Row.of("plan", p, title=p.title, brief=p.brief, refs=[f"todo:{t.id}" for t in tasks], completed=seconds(p.updated_at) if p.state == PlanState.DONE else 0.0,
                                 data={"status": STATUS[p.state], "stage": "todos", "phases": [{"title": "Tasks", "todos": [t.id for t in tasks], "checkpoint": ""}], "dismissed": False}))
        return rows
